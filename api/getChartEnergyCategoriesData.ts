import { basketProductsResponse } from "@/data/basketProductsResponse";
import {
  BasketProduct,
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MetricOptions,
  SelectedBasketIds,
} from "@/types/types";

const aggregateCategories = (
  filteredProducts: any[]
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

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

const fetchData = (
  selectedBasketIds: SelectedBasketIds // API body parameter
): BasketProduct[] => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  const body = {
    basketIds: selectedBasketIds, // list of basketIds
  };
  return basketProductsResponse;
};

export const getChartEnergyCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMetric: MetricOptions // Client side selection
): ChartEnergyCategoriesData[] => {
  const data = fetchData(selectedBasketIds);
  const filteredProducts = data
    .filter((basket) => selectedBasketIds.includes(basket.basketId))
    .flatMap((basket) => basket.products);

  const dynamicChartMacroCategoriesResponse =
    aggregateCategories(filteredProducts);

  return mapChartEnergyCategoriesResponse(
    dynamicChartMacroCategoriesResponse,
    selectedMetric
  );
};
