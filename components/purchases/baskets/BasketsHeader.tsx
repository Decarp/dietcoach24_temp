import { useCounterStore } from "@/providers/useStoreProvider";
import { classNames } from "@/utils/classNames";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

const BasketsHeader = ({
  baskets,
  areLastNWeeksSelected,
  selectLastNWeeks,
}: {
  baskets: any;
  areLastNWeeksSelected: () => boolean;
  selectLastNWeeks: () => void;
}) => {
  const { selectedBasketIds } = useCounterStore((state) => state);

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
      (acc: number, basket: any) => acc + basket.numProducts,
      0
    );
    const avgNutriScore: number =
      selectedBaskets.reduce(
        (acc: number, basket: any) => acc + basket.avgNutriscore,
        0
      ) / numBaskets;

    return { numBaskets, numProducts, avgNutriScore };
  };

  const { numBaskets, numProducts, avgNutriScore } = calculateStats();

  return (
    <div className="border-b border-gray-300 pb-[17px]">
      <h2 className="pl-8 text-xl font-semibold">Einkäufe</h2>
      <div className="flex items-center pl-8 relative">
        <h3 className="text-xs font-light text-gray-500">
          {numBaskets} {numBaskets === 1 ? "Einkauf" : "Einkäufe"} mit{" "}
          {numProducts} Lebensmitteln
        </h3>
        <div className="relative group">
          <InformationCircleIcon className="ml-1 h-5 w-5 text-gray-400 cursor-pointer" />
          <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block px-2 py-1 bg-gray-500 text-white text-xs rounded-md">
            only matched products
          </div>
        </div>
      </div>
      <button
        className={classNames(
          "mt-1.5 ml-8 text-sm px-2 py-1 rounded-md border border-gray-300",
          areLastNWeeksSelected()
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-500"
        )}
        onClick={selectLastNWeeks}
      >
        Neueste {8} Wochen wählen
      </button>
    </div>
  );
};

export default BasketsHeader;
