import { basketProductsResponse } from "@/data/basketProductsResponse";
import {
  ChartMacroData,
  ChartMacroResponse,
  LanguageOptions,
  MetricOptions,
  SelectedBasketIds,
} from "@/types/types";

const aggregateMacros = (filteredProducts: any[]): ChartMacroResponse[] => {
  const macros = {
    Carbohydrates: { de: "Kohlenhydrate", en: "Carbohydrates", kcal: 0, g: 0 },
    Fats: { de: "Fette", en: "Fats", kcal: 0, g: 0 },
    Proteins: { de: "Proteine", en: "Proteins", kcal: 0, g: 0 },
    Fibre: { de: "Nahrungsfasern", en: "Fibre", kcal: 0, g: 0 },
  };

  filteredProducts.forEach((product) => {
    const { nutrients } = product;
    const { carbohydrates, fats, proteins, fibers, kcal } = nutrients;

    macros.Carbohydrates.kcal += carbohydrates * 4; // Carbohydrates: 4 kcal per gram
    macros.Carbohydrates.g += carbohydrates;

    macros.Fats.kcal += fats * 9; // Fats: 9 kcal per gram
    macros.Fats.g += fats;

    macros.Proteins.kcal += proteins * 4; // Proteins: 4 kcal per gram
    macros.Proteins.g += proteins;

    macros.Fibre.kcal += fibers * 2; // Fibres: 2 kcal per gram (approx.)
    macros.Fibre.g += fibers;
  });

  return Object.values(macros).map(({ de, en, kcal, g }) => ({
    name: { de, en },
    values: { kcal, g },
  }));
};

const mapChartMacroResponse = (
  chartMacroResponse: ChartMacroResponse[],
  selectedMetric: MetricOptions,
  language: LanguageOptions = "de"
): ChartMacroData[] => {
  return chartMacroResponse.map((item) => ({
    name: item.name[language],
    value: item.values[selectedMetric],
    metric: selectedMetric,
  }));
};

const fetchData = (
  selectedBasketIds: SelectedBasketIds // API body parameter
) => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  const body = {
    basketIds: selectedBasketIds, // list of basketIds
  };
  return basketProductsResponse;
};

export const getChartMacroData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMetric: MetricOptions // Client side selection
): ChartMacroData[] => {
  const data = fetchData(selectedBasketIds);
  const filteredProducts = data
    .filter((basket) => selectedBasketIds.includes(basket.basketId))
    .flatMap((basket) => basket.products);

  const dynamicChartMacroResponse = aggregateMacros(filteredProducts);

  return mapChartMacroResponse(dynamicChartMacroResponse, selectedMetric);
};
