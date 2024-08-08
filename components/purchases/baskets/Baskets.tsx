import { useEffect, useRef } from "react";
import { getBaskets } from "@/api/getBaskets";
import { useCounterStore } from "@/providers/useStoreProvider";
import { classNames } from "@/utils/classNames";
import { formatDate } from "@/utils/formatDate";
import { mapBasketsResponse } from "@/utils/mapBasketsResponse";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import BasketsHeader from "./BasketsHeader";
import { parse } from "date-fns";
import { de } from "date-fns/locale";

const Baskets = () => {
  const basketsResponse = getBaskets();
  const baskets = mapBasketsResponse(basketsResponse);

  const {
    selectedBasketIds,
    setSelectedBasketIds,
    selectedBasketProductIds,
    setSelectedBasketProductIds,
  } = useCounterStore((state) => state);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const sortedMonths = Object.keys(baskets).sort((a, b) => {
        const dateA = parse(a, "MMMM yyyy", new Date(), {
          locale: de,
        }).getTime();
        const dateB = parse(b, "MMMM yyyy", new Date(), {
          locale: de,
        }).getTime();
        return dateB - dateA;
      });

      const latestMonth = sortedMonths[0];
      console.log("Latest month:", latestMonth); // Debugging log
      const latestMonthBasketIds = baskets[latestMonth].map(
        (basket: any) => basket.basketId
      );
      console.log("Latest month basket IDs:", latestMonthBasketIds); // Debugging log
      setSelectedBasketIds(latestMonthBasketIds);
      initialized.current = true;
    }
  }, [baskets, setSelectedBasketIds]);

  const handleBasketCheckboxChange = (basketId: string) => {
    if (selectedBasketIds.includes(basketId)) {
      // Deselect basket and its products
      setSelectedBasketIds(
        selectedBasketIds.filter((item) => item !== basketId)
      );
      setSelectedBasketProductIds(
        selectedBasketProductIds.filter(
          (product) => product.basketId !== basketId
        )
      );
    } else {
      // Select basket
      setSelectedBasketIds([...selectedBasketIds, basketId]);
    }
  };

  const handleSelectAllChange = (letter: string, selectAll: boolean) => {
    const basketIds = baskets[letter].map((basket: any) => basket.basketId);
    if (selectAll) {
      // Select all baskets in the section
      setSelectedBasketIds([
        ...selectedBasketIds,
        ...basketIds.filter((id: string) => !selectedBasketIds.includes(id)),
      ]);
    } else {
      // Deselect all baskets in the section
      setSelectedBasketIds(
        selectedBasketIds.filter((id) => !basketIds.includes(id))
      );
    }
  };

  return (
    <div className="pt-6 -ml-8 bg-white border-x flex flex-col border-b border-gray-200 xl:w-64 xl:shrink-0 h-[calc(100vh-183px)]">
      <BasketsHeader baskets={baskets} />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        <nav aria-label="Baskets List" className="overflow-y-auto">
          {Object.keys(baskets).map((letter) => {
            const allSelected = baskets[letter].every((basket: any) =>
              selectedBasketIds.includes(basket.basketId)
            );

            return (
              <div key={letter} className="relative">
                <div className="pl-8 sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                  <div className="flex justify-between items-center">
                    <h3>{letter}</h3>
                    <input
                      type="checkbox"
                      className="mr-4 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={allSelected}
                      onChange={(e) =>
                        handleSelectAllChange(letter, e.target.checked)
                      }
                    />
                  </div>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                  {baskets[letter].map((person: any) => (
                    <li
                      key={person.basketId}
                      className={classNames(
                        "pl-8 flex items-center gap-x-4 px-3 py-5",
                        selectedBasketIds.includes(person.basketId)
                          ? "bg-primary text-white"
                          : ""
                      )}
                    >
                      <ShoppingCartIcon
                        className={classNames(
                          "border border-gray-200 h-12 w-12 p-2 flex-none rounded-md",
                          selectedBasketIds.includes(person.basketId)
                            ? "bg-white text-primary"
                            : "bg-gray-50 text-primary"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={classNames(
                            "text-base font-semibold leading-6",
                            selectedBasketIds.includes(person.basketId)
                              ? "text-white"
                              : "text-gray-900"
                          )}
                        >
                          Einkauf {person.index}
                        </p>
                        <p
                          className={classNames(
                            "truncate text-sm leading-5",
                            selectedBasketIds.includes(person.basketId)
                              ? "text-white"
                              : "text-gray-500"
                          )}
                        >
                          {formatDate(person.timestamp)}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 mr-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedBasketIds.includes(person.basketId)}
                        onChange={() =>
                          handleBasketCheckboxChange(person.basketId)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Baskets;
