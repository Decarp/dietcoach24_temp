import { basketProductsResponse } from "@/data/basketProductsResponse";
import type { SelectedBasketIds } from "@/app/p/[id]/purchases/page";

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

export const getChartMacroCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMetric: MetricOptions // Client side selection
): ChartMacroCategoriesData[] => {
  const data = fetchData(selectedBasketIds);
  const filteredProducts = data
    .filter((basket) => selectedBasketIds.includes(basket.basketId))
    .flatMap((basket) => basket.products);

  const dynamicChartMacroCategoriesResponse =
    aggregateCategories(filteredProducts);

  return mapChartMacroCategoriesResponse(
    dynamicChartMacroCategoriesResponse,
    selectedMetric
  );
};
