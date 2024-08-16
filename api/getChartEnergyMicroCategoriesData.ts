import {
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MicroCategory,
  Product,
  SelectedBasketIds,
} from "@/types/types";
import { getBasketProducts } from "./getBasketProducts";

const aggregateMicroCategories = (
  products: Product[],
  selectedMicro: MicroCategory
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

  products.forEach((product) => {
    const { dietCoachCategoryL1, nutrients } = product;
    const { salt, sugar, saturatedFats } = nutrients;
    const categoryName = dietCoachCategoryL1.de;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        values: { percentage: 0 },
      };
    }

    let value = 0;
    switch (selectedMicro) {
      case "Salz":
        value = salt;
        break;
      case "Zucker":
        value = sugar;
        break;
      case "Gesättigte Fettsäuren":
        value = saturatedFats;
        break;
    }

    categories[categoryName].values.percentage += value;
  });

  return Object.values(categories).sort(
    (a, b) => b.values.percentage - a.values.percentage
  );
};

const mapChartEnergyMicroCategoriesResponse = (
  chartMicroCategoriesResponse: ChartEnergyCategoriesResponse[],
  language: LanguageOptions = "de"
): ChartEnergyCategoriesData[] => {
  // Calculate the total grams for the selected micro across all categories
  const totalGrams = chartMicroCategoriesResponse.reduce(
    (sum, item) => sum + item.values.percentage,
    0
  );

  // Map the response to include percentage instead of grams
  return chartMicroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: totalGrams > 0 ? (item.values.percentage / totalGrams) * 100 : 0, // Calculate the percentage
  }));
};

export const getChartEnergyMicroCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMicro: MicroCategory // Client side selection
): ChartEnergyCategoriesData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyMicroCategoriesResponse = aggregateMicroCategories(
    products,
    selectedMicro
  );

  return mapChartEnergyMicroCategoriesResponse(
    dynamicChartEnergyMicroCategoriesResponse
  );
};
