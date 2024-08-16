import {
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MicroCategory,
  Product,
  SelectedBasketIds,
} from "@/types/types";
import { getBasketProducts } from "./getBasketProducts";

const aggregateMacroCategories = (
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
        values: { g: 0 },
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

    categories[categoryName].values["g"] += value;
  });

  return Object.values(categories).sort(
    (a, b) => b.values["g"] - a.values["g"]
  );
};

const mapChartEnergyMacroCategoriesResponse = (
  chartMacroCategoriesResponse: ChartEnergyCategoriesResponse[],
  language: LanguageOptions = "de"
): ChartEnergyCategoriesData[] => {
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: item.values["g"],
    metric: "g", // Hardcoded as "g" since we're no longer using `selectedMetric`
  }));
};

export const getChartEnergyMicroCategoriesData = (
  selectedBasketIds: SelectedBasketIds, // API body parameter
  selectedMicro: MicroCategory // Client side selection
): ChartEnergyCategoriesData[] => {
  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const products = basketProductsResponse.flatMap((basket) => basket.products);

  const dynamicChartEnergyMacroCategoriesResponse = aggregateMacroCategories(
    products,
    selectedMicro
  );

  return mapChartEnergyMacroCategoriesResponse(
    dynamicChartEnergyMacroCategoriesResponse
  );
};
