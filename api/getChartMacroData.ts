import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";
import { chartMacroResponse } from "@/data/chartMacroResponse";
import { basketProductsResponseNew } from "@/data/basketProductsResponseNew";
import {
  mapChartMacroResponse,
  MetricOptions,
  ChartMacroResponse,
} from "@/utils/mapChartMacroResponse";

const MOCK = true;

const aggregateMacros = (filteredProducts: any[]): ChartMacroResponse[] => {
  const macros = {
    Carbohydrates: { de: "Kohlenhydrate", en: "Carbohydrates", kcal: 0, g: 0 },
    Fats: { de: "Fette", en: "Fats", kcal: 0, g: 0 },
    Proteins: { de: "Proteine", en: "Proteins", kcal: 0, g: 0 },
    Fibre: { de: "Nahrungsfasern", en: "Fibre", kcal: 0, g: 0 },
  };

  filteredProducts.forEach((product) => {
    const { carbs, fat, protein, fiber, kcal } = product;

    macros.Carbohydrates.kcal += carbs * 4; // Carbohydrates: 4 kcal per gram
    macros.Carbohydrates.g += carbs;

    macros.Fats.kcal += fat * 9; // Fats: 9 kcal per gram
    macros.Fats.g += fat;

    macros.Proteins.kcal += protein * 4; // Proteins: 4 kcal per gram
    macros.Proteins.g += protein;

    macros.Fibre.kcal += fiber * 2; // Fibres: 2 kcal per gram (approx.)
    macros.Fibre.g += fiber;
  });

  return Object.values(macros).map(({ de, en, kcal, g }) => ({
    name: { de, en },
    values: { kcal, g },
  }));
};

export const getChartMacroData = (
  checkedBaskets: SelectedBasketIds, // API body parameter
  selectedMetric: MetricOptions // Client side selection
) => {
  if (MOCK) {
    const filteredProducts = basketProductsResponseNew
      .filter((basket) => checkedBaskets.includes(basket.basketId))
      .flatMap((basket) => basket.products);

    const dynamicChartMacroResponse = aggregateMacros(filteredProducts);

    return mapChartMacroResponse(dynamicChartMacroResponse, selectedMetric);
  }

  return mapChartMacroResponse(chartMacroResponse, selectedMetric);
};
