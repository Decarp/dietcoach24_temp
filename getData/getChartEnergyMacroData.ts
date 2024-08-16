import {
  ChartEnergyMacroData,
  ChartEnergyMacroResponse,
  LanguageOptions,
  Product,
  SelectedBasketIds,
} from "@/types/types";
import { getBasketProducts } from "./getBasketProducts";

const aggregateMacros = (products: Product[]): ChartEnergyMacroResponse[] => {
  const macros = {
    Carbohydrates: { de: "Kohlenhydrate", en: "Carbohydrates", percentage: 0 },
    Fats: { de: "Fette", en: "Fats", percentage: 0 },
    Proteins: { de: "Proteine", en: "Proteins", percentage: 0 },
    Other: { de: "Weitere Nährstoffe", en: "Other Nutrients", percentage: 0 },
  };

  products.forEach((product) => {
    const { nutrients } = product;
    const { carbohydrates, fats, proteins, fibers } = nutrients;

    // Accumulate grams for each macro nutrient
    macros.Carbohydrates.percentage += carbohydrates;
    macros.Fats.percentage += fats;
    macros.Proteins.percentage += proteins;
    macros.Other.percentage += fibers; // assuming fibers contribute to "Other" in grams
  });

  return Object.values(macros).map(({ de, en, percentage }) => ({
    name: { de, en },
    values: { percentage },
  }));
};

const mapChartEnergyMacroResponse = (
  chartMacroResponse: ChartEnergyMacroResponse[],
  language: LanguageOptions = "de"
): ChartEnergyMacroData[] => {
  // Calculate the total grams across all macros
  const totalGrams = chartMacroResponse.reduce(
    (sum, item) => sum + item.values.percentage,
    0
  );

  // Map the response to include percentage instead of grams
  return chartMacroResponse.map((item) => ({
    name: item.name[language],
    value: totalGrams > 0 ? (item.values.percentage / totalGrams) * 100 : 0, // Calculate the percentage
  }));
};

export const getChartEnergyMacroData = (
  selectedBasketIds: SelectedBasketIds // API body parameter
): ChartEnergyMacroData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyMacroResponse = aggregateMacros(products);

  return mapChartEnergyMacroResponse(dynamicChartEnergyMacroResponse);
};
