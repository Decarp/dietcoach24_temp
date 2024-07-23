import { CheckedBaskets } from "@/app/p/[id]/purchases/page";
import { chartMacroCategoriesResponse } from "@/data/chartMacroCategoriesResponse";
import { productsResponseNew } from "@/data/productsResponseNew";
import {
  mapChartMacroCategoriesResponse,
  MetricOptions,
  ChartMacroCategoriesResponse,
} from "@/utils/mapChartMacroCategoriesResponse";

const MOCK = true;

const aggregateCategories = (
  filteredProducts: any[]
): ChartMacroCategoriesResponse[] => {
  const categories: { [key: string]: ChartMacroCategoriesResponse } = {};

  filteredProducts.forEach((product) => {
    const { category, kcal, protein, fat, carbs, fiber } = product;
    const categoryName = category.en;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: category,
        values: { kcal: 0, g: 0 },
      };
    }

    categories[categoryName].values.kcal += kcal;
    categories[categoryName].values.g += protein + fat + carbs + fiber;
  });

  return Object.values(categories);
};

export const getChartMacroCategoriesData = (
  checkedBaskets: CheckedBaskets,
  selectedMetric: MetricOptions
) => {
  if (MOCK) {
    const filteredProducts = productsResponseNew
      .filter((basket) => checkedBaskets.includes(basket.basketId))
      .flatMap((basket) => basket.products);

    const dynamicChartMacroCategoriesResponse =
      aggregateCategories(filteredProducts);

    return mapChartMacroCategoriesResponse(
      dynamicChartMacroCategoriesResponse,
      selectedMetric
    );
  }

  return mapChartMacroCategoriesResponse(
    chartMacroCategoriesResponse,
    selectedMetric
  );
};
