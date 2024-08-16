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
        values: { g: 0 },
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
