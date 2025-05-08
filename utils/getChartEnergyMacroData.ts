import { BasketProduct, ChartEnergyMacroData, ChartEnergyMacroResponse, LanguageOptions, Product } from '@/types/types';

const aggregateMacros = (products: Product[]): ChartEnergyMacroResponse[] => {
    const macros = {
        Carbohydrates: { de: 'Kohlenhydrate', en: 'Carbohydrates', grams: 0 },
        Fats: { de: 'Fette', en: 'Fats', grams: 0 },
        Proteins: { de: 'Proteine', en: 'Proteins', grams: 0 },
        Other: { de: 'Weitere Nährstoffe', en: 'Other Nutrients', grams: 0 },
    };

    products.forEach((product) => {
        const { nutrients } = product;

        // Default to 0 if nutrients or any of the values are undefined or null
        const carbohydrates = nutrients?.carbohydrates || 0;
        const fats = nutrients?.fats || 0;
        const proteins = nutrients?.proteins || 0;
        const fibers = nutrients?.fibres || 0;

        // Accumulate grams for each macro nutrient
        macros.Carbohydrates.grams += carbohydrates;
        macros.Fats.grams += fats;
        macros.Proteins.grams += proteins;
        macros.Other.grams += fibers; // assuming fibers contribute to "Other" in grams
    });

    const toReturn = Object.values(macros).map(({ de, en, grams }) => ({
        name: { de, en },
        grams,
    }));

    return toReturn;
};

const mapChartEnergyMacroResponse = (
    chartMacroResponse: ChartEnergyMacroResponse[],
    language: LanguageOptions = 'de',
): ChartEnergyMacroData[] => {
    // Calculate the total grams across all macros, ensure it's a valid number
    const totalGrams = chartMacroResponse.reduce((sum, item) => sum + (item.grams || 0), 0);

    // Map the response to include percentage instead of grams
    const toReturn = chartMacroResponse.map((item) => ({
        name: item.name[language],
        value: totalGrams > 0 ? (item.grams / totalGrams) * 100 : 0, // Calculate the percentage
    }));

    return toReturn;
};

export const getChartEnergyMacroData = (products: BasketProduct[]): ChartEnergyMacroData[] => {
    const productsFlattened = products.flatMap((basket) => basket.products);

    const dynamicChartEnergyMacroResponse = aggregateMacros(productsFlattened);

    const toReturn = mapChartEnergyMacroResponse(dynamicChartEnergyMacroResponse);

    return toReturn;
};
