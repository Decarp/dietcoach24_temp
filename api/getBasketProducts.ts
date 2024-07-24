import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";
import { basketProductsResponse } from "@/data/basketProductsResponse";

export const getBasketProducts = (selectedBasketIds: SelectedBasketIds) => {
  return basketProductsResponse.filter((basket) =>
    selectedBasketIds.includes(basket.basketId)
  );
};
