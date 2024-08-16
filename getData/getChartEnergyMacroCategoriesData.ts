import {
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MacroCategory,
  Product,
  SelectedBasketIds,
} from "@/types/types";
import { getBasketProducts } from "./getBasketProducts";

const aggregateMacroCategories = (
  products: Product[],
  selectedMacro: MacroCategory
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

  products.forEach((product) => {
    const { dietCoachCategoryL1, nutrients } = product;
    const { carbohydrates, fats, proteins, fibers } = nutrients;
    const categoryName = dietCoachCategoryL1.de;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        values: { percentage: 0 },
      };
    }

    let value = 0;
    switch (selectedMacro) {
      case "Kohlenhydrate":
        value = carbohydrates;
        break;
      case "Fette":
        value = fats;
        break;
      case "Proteine":
        value = proteins;
        break;
      case "Nahrungsfasern":
        value = fibers;
        break;
    }

    categories[categoryName].values.percentage += value;
  });

  return Object.values(categories).sort(
    (a, b) => b.values.percentage - a.values.percentage
  );
};

const mapChartEnergyMacroCategoriesResponse = (
  chartMacroCategoriesResponse: ChartEnergyCategoriesResponse[],
  language: LanguageOptions = "de"
): ChartEnergyCategoriesData[] => {
  // Calculate the total grams for the selected macro across all categories
  const totalGrams = chartMacroCategoriesResponse.reduce(
    (sum, item) => sum + item.values.percentage,
    0
  );

  // Map the response to include percentage instead of grams
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: totalGrams > 0 ? (item.values.percentage / totalGrams) * 100 : 0, // Calculate the percentage
  }));
};

export const getChartEnergyMacroCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMacro: MacroCategory // Client side selection
): ChartEnergyCategoriesData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyMacroCategoriesResponse = aggregateMacroCategories(
    products,
    selectedMacro
  );

  return mapChartEnergyMacroCategoriesResponse(
    dynamicChartEnergyMacroCategoriesResponse
  );
};
