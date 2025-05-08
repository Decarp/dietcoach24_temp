import { BasketProduct, Product } from '@/types/types';

export const fetchBasketProducts = async (
    patientId: string,
    selectedBasketIds: string[],
    token: string,
): Promise<BasketProduct[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/basket-products`, {
        method: 'POST',
        headers: {
            Authentication: token,
            'Participant-Id': patientId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            basketIds: selectedBasketIds,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch basket products: ${response.statusText}`);
    }

    const data: BasketProduct[] = await response.json();

    // Remove duplicates per basket
    const processedData: BasketProduct[] = data.map((basket) => {
        const uniqueProducts: Map<number, Product> = new Map();

        basket.products.forEach((product) => {
            if (!uniqueProducts.has(product.gtin)) {
                uniqueProducts.set(product.gtin, product);
            }
        });

        return {
            ...basket,
            products: Array.from(uniqueProducts.values()),
        };
    });

    return processedData;
};
