import {
    BasketProduct,
    ChartEnergyCategoriesData,
    ChartEnergyCategoriesResponse,
    LanguageOptions,
    Product,
} from '@/types/types';

const aggregateCategories = (products: Product[]): ChartEnergyCategoriesResponse[] => {
    const categories: { [key: string]: ChartEnergyCategoriesResponse } = {};

    products.forEach((product) => {
        const { dietCoachCategoryL1, nutrients } = product;

        // Ensure each nutrient value is defined and use 0 as a fallback
        const proteins = nutrients?.proteins || 0;
        const fats = nutrients?.fats || 0;
        const carbohydrates = nutrients?.carbohydrates || 0;
        const fibers = nutrients?.fibres || 0;

        const categoryName = dietCoachCategoryL1.en;

        if (!categories[categoryName]) {
            categories[categoryName] = {
                name: dietCoachCategoryL1,
                grams: 0,
            };
        }

        // Accumulate grams for each category
        categories[categoryName].grams += proteins + fats + carbohydrates + fibers;
    });

    // Sort categories alphabetically
    return Object.values(categories).sort((a, b) => a.name.en.localeCompare(b.name.en));
};

const mapChartEnergyCategoriesResponse = (
    chartMacroCategoriesResponse: ChartEnergyCategoriesResponse[],
    language: LanguageOptions = 'de',
): ChartEnergyCategoriesData[] => {
    // Calculate the total grams across all categories
    const totalGrams = chartMacroCategoriesResponse.reduce((sum, item) => sum + (item.grams || 0), 0);

    // Map the response to include percentage instead of grams
    return chartMacroCategoriesResponse.map((item) => ({
        name: item.name[language],
        value: totalGrams > 0 ? (item.grams / totalGrams) * 100 : 0, // Calculate the percentage
    }));
};

export const getChartEnergyCategoriesData = (products: BasketProduct[]): ChartEnergyCategoriesData[] => {
    const productsFlattened = products.flatMap((basket) => basket.products || []);

    const dynamicChartEnergyCategoriesResponse = aggregateCategories(productsFlattened);

    return mapChartEnergyCategoriesResponse(dynamicChartEnergyCategoriesResponse);
};
