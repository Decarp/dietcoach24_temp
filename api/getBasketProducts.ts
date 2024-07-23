import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";
import { basketProductsResponseNew } from "@/data/basketProductsResponseNew";

export const getBasketProducts = (selectedBasketIds: SelectedBasketIds) => {
  return basketProductsResponseNew.filter((basket) =>
    selectedBasketIds.includes(basket.basketId)
  );
};
