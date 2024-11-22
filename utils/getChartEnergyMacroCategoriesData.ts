import {
  BasketProduct,
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MacroCategory,
  Product,
} from "@/types/types";

const aggregateMacroCategories = (
  products: Product[],
  selectedMacro: MacroCategory
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

  products.forEach((product) => {
    const { dietCoachCategoryL1, nutrients } = product;
    const { carbohydrates, fats, proteins, fibres: fibers } = nutrients;
    const categoryName = dietCoachCategoryL1.de;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        grams: 0,
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

    categories[categoryName].grams += value;
  });

  return Object.values(categories).sort((a, b) => b.grams - a.grams);
};

const mapChartEnergyMacroCategoriesResponse = (
  chartMacroCategoriesResponse: ChartEnergyCategoriesResponse[],
  language: LanguageOptions = "de"
): ChartEnergyCategoriesData[] => {
  // Calculate the total grams for the selected macro across all categories
  const totalGrams = chartMacroCategoriesResponse.reduce(
    (sum, item) => sum + (item.grams || 0),
    0
  );

  // Map the response to include percentage instead of grams
  return chartMacroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: totalGrams > 0 ? (item.grams / totalGrams) * 100 : 0, // Calculate the percentage
  }));
};

export const getChartEnergyMacroCategoriesData = (
  products: BasketProduct[],
  selectedMacro: MacroCategory // Client side selection
): ChartEnergyCategoriesData[] => {
  const productsFlattened = products.flatMap((basket) => basket.products);

  const dynamicChartEnergyMacroCategoriesResponse = aggregateMacroCategories(
    productsFlattened,
    selectedMacro
  );

  return mapChartEnergyMacroCategoriesResponse(
    dynamicChartEnergyMacroCategoriesResponse
  );
};
