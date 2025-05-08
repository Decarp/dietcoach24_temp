export const mapBasketProductsResponse = (basketsResponse: any[], productsResponse: any[]) => {
    // Reduce the productsResponse to an object with basket index as key
    const productsMap = productsResponse.reduce((acc: any, basket: any) => {
        const basketIndex = basket.index;
        const basketTimestamp = basket.timestamp;
        if (basketIndex !== undefined) {
            acc[basketIndex] = basket.products.map((product: any) => ({
                basketId: basket.basketId,
                timestamp: basketTimestamp,
                ...product,
            }));
        }
        return acc;
    }, {});

    // Convert the object to an array, sort by basket index in descending order, and convert back to an object
    const sortedProducts = Object.keys(productsMap)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .reduce((acc: any, key: string) => {
            acc[key] = productsMap[key];
            return acc;
        }, {});

    return sortedProducts;
};
