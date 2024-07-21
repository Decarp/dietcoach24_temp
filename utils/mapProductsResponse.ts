export const mapProductsResponse = (
  productsResponse: any,
  basketsResponse: any
) => {
  // Reduce the productsResponse to an object with basket index as key
  const productsMap = Object.keys(productsResponse[0]).reduce(
    (acc: any, basketId: string) => {
      const basketIndex = basketsResponse.find(
        (basket: any) => basket.basketId === parseInt(basketId)
      )!.index;
      const basketTimestamp = basketsResponse.find(
        (basket: any) => basket.basketId === parseInt(basketId)
      )!.timestamp;
      if (basketIndex) {
        acc[basketIndex] = productsResponse[0][basketId].map(
          (product: any) => ({
            basketId: parseInt(basketId),
            timestamp: basketTimestamp,
            ...product,
          })
        );
      }
      return acc;
    },
    {}
  );

  // Convert the object to an array, sort by basket index in descending order, and convert back to an object
  const sortedProducts = Object.keys(productsMap)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .reduce((acc: any, key: string) => {
      acc[key] = productsMap[key];
      return acc;
    }, {});

  return sortedProducts;
};
