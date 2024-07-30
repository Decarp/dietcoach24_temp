import { basketProductsResponse } from "@/data/basketProductsResponse";
import type { SelectedBasketIds } from "@/app/p/[id]/purchases/page";

const fetchData = (selectedBasketIds: SelectedBasketIds) => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  const body = {
    basketIds: selectedBasketIds, // list of basketIds
  };
  return basketProductsResponse;
};

export const getBasketProducts = (selectedBasketIds: SelectedBasketIds) => {
  const data = fetchData(selectedBasketIds);
  return data.filter((basket) => selectedBasketIds.includes(basket.basketId));
};
