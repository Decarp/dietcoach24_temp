import {
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  Product,
  SelectedBasketIds,
} from "@/types/types";
import { getBasketProducts } from "./getBasketProducts";

const aggregateCategories = (
  products: Product[]
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

  products.forEach((product) => {
    const { dietCoachCategoryL1, nutrients } = product;
    const { proteins, fats, carbohydrates, fibers } = nutrients;
    const categoryName = dietCoachCategoryL1.en;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        values: { percentage: 0 }, // Updated to `percentage`
      };
    }

    categories[categoryName].values.percentage +=
      proteins + fats + carbohydrates + fibers;
  });

  // Sort categories ascending alphabetically
  return Object.values(categories).sort((a, b) =>
    a.name.en.localeCompare(b.name.en)
  );
};

const mapChartEnergyCategoriesResponse = (
  chartMacroCategoriesResponse: ChartEnergyCategoriesResponse[],
  language: LanguageOptions = "de"
): ChartEnergyCategoriesData[] => {
  // Calculate the total grams across all categories
  const totalGrams = chartMacroCategoriesResponse.reduce(
    (sum, item) => sum + item.values.percentage, // Now calculating based on `percentage`
    0
  );

  // Map the response to include percentage instead of grams
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: totalGrams > 0 ? (item.values.percentage / totalGrams) * 100 : 0, // Calculate the percentage
  }));
};

export const getChartEnergyCategoriesData = (
  selectedBasketIds: SelectedBasketIds // API body parameter
): ChartEnergyCategoriesData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyCategoriesResponse = aggregateCategories(products);

  return mapChartEnergyCategoriesResponse(dynamicChartEnergyCategoriesResponse);
};
