import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";
import React from "react";

const BasketsHeader = ({
  baskets,
  selectedBasketIds,
}: {
  baskets: any;
  selectedBasketIds: SelectedBasketIds;
}) => {
  const calculateStats = () => {
    const selectedBaskets =
      selectedBasketIds.length > 0
        ? Object.values(baskets)
            .flat()
            .filter((basket: any) =>
              selectedBasketIds.includes(basket.basketId)
            )
        : Object.values(baskets).flat();

    const numBaskets: number = selectedBaskets.length;
    const numProducts: number = selectedBaskets.reduce(
      (acc: number, basket: any) => acc + basket.num_products,
      0
    );
    const avgNutriScore: number =
      selectedBaskets.reduce(
        (acc: number, basket: any) => acc + basket.avg_nutriscore,
        0
      ) / numBaskets;

    return { numBaskets, numProducts, avgNutriScore };
  };

  const { numBaskets, numProducts, avgNutriScore } = calculateStats();

  return (
    <>
      <h2 className="pl-8 text-xl font-semibold">Einkäufe</h2>
      <h3 className="pl-8 text-sm font-light mb-4 text-gray-500">
        Zeige {numBaskets} {numBaskets === 1 ? "Einkauf" : "Einkäufe"} mit{" "}
        {numProducts} Artikeln
      </h3>
    </>
  );
};

export default BasketsHeader;
