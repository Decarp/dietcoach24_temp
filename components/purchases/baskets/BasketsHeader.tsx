import Button from "@/components/Button";
import { useCounterStore } from "@/providers/useStoreProvider";
import { classNames } from "@/utils/classNames";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";

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
              selectedBasketIds.includes(basket.basketId),
            )
        : Object.values(baskets).flat();

    const numBaskets: number = selectedBaskets.length;
    const numProducts: number = selectedBaskets.reduce(
      (acc: number, basket: any) => acc + basket.numProducts,
      0,
    );
    const avgNutriScore: number =
      selectedBaskets.reduce(
        (acc: number, basket: any) => acc + basket.avgNutriscore,
        0,
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
      </div>
      <Button
        onClick={selectLastNWeeks}
        className={classNames(
          "mt-2.5 ml-8 text-sm px-2 py-1 rounded-md border",
        )}
        icon={<CalendarDateRangeIcon className="h-5 w-5" />}
      >
        {!areLastNWeeksSelected() ? "8 Wochen auswählen" : "8 Wochen abwählen"}
      </Button>
    </div>
  );
};

export default BasketsHeader;
