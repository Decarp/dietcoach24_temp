import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";
import { basketProductsResponse } from "@/data/basketProductsResponse";

export type ChartMacroCategoriesResponse = {
  name: {
    de: string;
    en: string;
  };
  values: {
    kcal: number;
    g: number;
  };
};

export type ChartMacroCategoriesData = {
  name: string;
  value: number;
  metric: string;
};

export type MetricOptions = "kcal" | "g";

export type LanguageOptions = "en" | "de";

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

  // sort categories ascending alphabetically
  return Object.values(categories).sort((a, b) =>
    a.name.en.localeCompare(b.name.en)
  );
};

const mapChartMacroCategoriesResponse = (
  chartMacroCategoriesResponse: ChartMacroCategoriesResponse[],
  selectedMetric: MetricOptions,
  language: LanguageOptions = "de"
): ChartMacroCategoriesData[] => {
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: item.values[selectedMetric],
    metric: selectedMetric,
  }));
};

export const getChartMacroCategoriesData = (
  checkedBaskets: SelectedBasketIds,
  selectedMetric: MetricOptions
): ChartMacroCategoriesData[] => {
  const filteredProducts = basketProductsResponse
    .filter((basket) => checkedBaskets.includes(basket.basketId))
    .flatMap((basket) => basket.products);

  const dynamicChartMacroCategoriesResponse =
    aggregateCategories(filteredProducts);

  return mapChartMacroCategoriesResponse(
    dynamicChartMacroCategoriesResponse,
    selectedMetric
  );
};
