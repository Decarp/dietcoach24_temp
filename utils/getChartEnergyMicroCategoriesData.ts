import {
  BasketProduct,
  ChartEnergyCategoriesData,
  ChartEnergyCategoriesResponse,
  LanguageOptions,
  MicroCategory,
  Product,
} from "@/types/types";

const aggregateMicroCategories = (
  products: Product[],
  selectedMicro: MicroCategory,
): ChartEnergyCategoriesResponse[] => {
  const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

  products.forEach((product) => {
    const { dietCoachCategoryL1, nutrients } = product;
    const { salt, sugars: sugar, saturatedFats } = nutrients;
    const categoryName = dietCoachCategoryL1.de;

    if (!categories[categoryName]) {
      categories[categoryName] = {
        name: dietCoachCategoryL1,
        grams: 0,
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

    categories[categoryName].grams += value;
  });

  return Object.values(categories).sort((a, b) => b.grams - a.grams);
};

const mapChartEnergyMicroCategoriesResponse = (
  chartMicroCategoriesResponse: ChartEnergyCategoriesResponse[],
  language: LanguageOptions = "de",
): ChartEnergyCategoriesData[] => {
  // Calculate the total grams for the selected micro across all categories
  const totalGrams = chartMicroCategoriesResponse.reduce(
    (sum, item) => sum + (item.grams || 0),
    0,
  );

  // Map the response to include percentage instead of grams
  return chartMicroCategoriesResponse.map((item) => ({
    name: item.name[language],
    value: totalGrams > 0 ? (item.grams / totalGrams) * 100 : 0, // Calculate the percentage
  }));
};

export const getChartEnergyMicroCategoriesData = (
  products: BasketProduct[],
  selectedMicro: MicroCategory, // Client side selection
): ChartEnergyCategoriesData[] => {
  const productsFlattened = products.flatMap((basket) => basket.products);

  const dynamicChartEnergyMicroCategoriesResponse = aggregateMicroCategories(
    productsFlattened,
    selectedMicro,
  );

  return mapChartEnergyMicroCategoriesResponse(
    dynamicChartEnergyMicroCategoriesResponse,
  );
};
