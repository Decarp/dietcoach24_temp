import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/classNames";
import BasketsHeader from "./BasketsHeader";
import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
  });
};

const Baskets = ({
  baskets,
  selectedBasketIds,
  handleBasketCheckboxChange,
}: {
  baskets: any;
  selectedBasketIds: SelectedBasketIds;
  handleBasketCheckboxChange: any;
}) => {
  return (
    <div className="pt-6 -ml-8 bg-white border-x flex flex-col border-b border-gray-200 xl:w-64 xl:shrink-0 max-h-[calc(100vh-187px)]">
      <BasketsHeader baskets={baskets} selectedBasketIds={selectedBasketIds} />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        <nav aria-label="Baskets List" className="overflow-y-auto">
          {Object.keys(baskets).map((letter) => (
            <div key={letter} className="relative">
              <div className="pl-8 sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                <h3>{letter}</h3>
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
                    <div className="min-w-0">
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
                      className="h-4 w-4 mx-auto rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedBasketIds.includes(person.basketId)}
                      onChange={() =>
                        handleBasketCheckboxChange(person.basketId)
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Baskets;
