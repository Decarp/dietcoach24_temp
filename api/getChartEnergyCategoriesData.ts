import {
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MetricOptions,
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
    const { kcal, proteins, fats, carbohydrates, fibers } = nutrients;
    const categoryName = dietCoachCategoryL1.en;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        values: { kcal: 0, g: 0 },
      };
    }

    categories[categoryName].values.kcal += kcal;
    categories[categoryName].values.g +=
      proteins + fats + carbohydrates + fibers;
  });

  // sort categories ascending alphabetically
  return Object.values(categories).sort((a, b) =>
    a.name.en.localeCompare(b.name.en)
  );
};

const mapChartEnergyCategoriesResponse = (
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

export const getChartEnergyCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMetric: MetricOptions // Client side selection
): ChartEnergyCategoriesData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyCategoriesResponse = aggregateCategories(products);

  return mapChartEnergyCategoriesResponse(
    dynamicChartEnergyCategoriesResponse,
    selectedMetric
  );
};
