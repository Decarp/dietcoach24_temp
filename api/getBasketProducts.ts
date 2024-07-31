import { basketProductsResponse } from "@/data/basketProductsResponse";
import { BasketProduct, SelectedBasketIds } from "@/types/types";

const MOCK = true;

const fetchData = (selectedBasketIds: SelectedBasketIds): BasketProduct[] => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  const body = {
    basketIds: selectedBasketIds, // list of basketIds
  };

  if (MOCK)
    return basketProductsResponse.filter((basket) =>
      selectedBasketIds.includes(basket.basketId)
    );

  return basketProductsResponse;
};

export const getBasketProducts = (
  selectedBasketIds: SelectedBasketIds
): BasketProduct[] => {
  const data = fetchData(selectedBasketIds);
  return data.filter((basket) => selectedBasketIds.includes(basket.basketId));
};
