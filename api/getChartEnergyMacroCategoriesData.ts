import {
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MacroCategory,
  MetricOptions,
  Product,
  SelectedBasketIds,
} from "@/types/types";
import { getBasketProducts } from "./getBasketProducts";

const aggregateMacroCategories = (
  products: Product[],
  selectedMacro: MacroCategory,
  selectedMetric: MetricOptions
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

  products.forEach((product) => {
    const { dietCoachCategoryL1, nutrients } = product;
    const { carbohydrates, fats, proteins, fibers } = nutrients;
    const categoryName = dietCoachCategoryL1.de;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        values: { kcal: 0, g: 0 },
      };
    }

    let value = 0;
    switch (selectedMacro) {
      case "Kohlenhydrate":
        value = selectedMetric === "kcal" ? carbohydrates * 4 : carbohydrates;
        break;
      case "Fette":
        value = selectedMetric === "kcal" ? fats * 9 : fats;
        break;
      case "Proteine":
        value = selectedMetric === "kcal" ? proteins * 4 : proteins;
        break;
      case "Nahrungsfasern":
        value = selectedMetric === "kcal" ? fibers * 2 : fibers;
        break;
    }

    categories[categoryName].values[selectedMetric] += value;
  });

  return Object.values(categories).sort(
    (a, b) => b.values[selectedMetric] - a.values[selectedMetric]
  );
};

const mapChartEnergyMacroCategoriesResponse = (
  chartMacroCategoriesResponse: ChartEnergyCategoriesResponse[],
  selectedMetric: MetricOptions,
  language: LanguageOptions = "de"
): ChartEnergyCategoriesData[] => {
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: item.values[selectedMetric],
    metric: selectedMetric,
  }));
};

export const getChartEnergyMacroCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMacro: MacroCategory, // Client side selection
  selectedMetric: MetricOptions // Client side selection
): ChartEnergyCategoriesData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyMacroCategoriesResponse = aggregateMacroCategories(
    products,
    selectedMacro,
    selectedMetric
  );

  return mapChartEnergyMacroCategoriesResponse(
    dynamicChartEnergyMacroCategoriesResponse,
    selectedMetric
  );
};
