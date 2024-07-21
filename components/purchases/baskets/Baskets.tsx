import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/classNames";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
  });
};

const Baskets = ({
  baskets,
  checkedBaskets,
  handleBasketCheckboxChange,
}: {
  baskets: any;
  checkedBaskets: any;
  handleBasketCheckboxChange: any;
}) => {
  const calculateStats = () => {
    const selectedBaskets =
      checkedBaskets.length > 0
        ? Object.values(baskets)
            .flat()
            .filter((basket: any) => checkedBaskets.includes(basket.basketId))
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
    <div className="flex flex-col border-b border-gray-200 py-6 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r">
      <h2 className="text-xl font-semibold">Einkäufe</h2>
      <h3 className="text-sm font-light mb-4 text-gray-500">
        Wähle aus {Object.values(baskets).flat().length} Einkäufen
      </h3>

      <div className="-ml-8">
        <nav aria-label="Baskets List" className="overflow-y-auto">
          {Object.keys(baskets).map((letter) => (
            <div key={letter} className="relative">
              <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                <h3>{letter}</h3>
              </div>
              <ul role="list" className="divide-y divide-gray-100">
                {baskets[letter].map((person: any) => (
                  <li
                    key={person.basketId}
                    className={classNames(
                      "pl-6 flex items-center gap-x-4 px-3 py-5",
                      checkedBaskets.includes(person.basketId)
                        ? "bg-primary text-white"
                        : ""
                    )}
                  >
                    <ShoppingCartIcon
                      className={classNames(
                        "border border-gray-200 h-12 w-12 p-2 flex-none rounded-md",
                        checkedBaskets.includes(person.basketId)
                          ? "bg-white text-primary"
                          : "bg-gray-50 text-primary"
                      )}
                    />
                    <div className="min-w-0">
                      <p
                        className={classNames(
                          "text-base font-semibold leading-6",
                          checkedBaskets.includes(person.basketId)
                            ? "text-white"
                            : "text-gray-900"
                        )}
                      >
                        Einkauf {person.index}
                      </p>
                      <p
                        className={classNames(
                          "truncate text-sm leading-5",
                          checkedBaskets.includes(person.basketId)
                            ? "text-white"
                            : "text-gray-500"
                        )}
                      >
                        {formatDate(person.timestamp)}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="ml-auto mr-2 rounded-sm form-checkbox h-5 w-5 text-primary"
                      checked={checkedBaskets.includes(person.basketId)}
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
        <div className="px-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Statistiken
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {checkedBaskets.length > 0 ? (
              <>
                <span>{numBaskets} ausgewählte Körbe</span>
                <br />
                <span>{numProducts} ausgewählte Produkte</span>
                <br />
                <span>
                  Durchschnittlicher Nutri-Score: {avgNutriScore.toFixed(2)}
                </span>
              </>
            ) : (
              <>
                <span>{numBaskets} Körbe insgesamt</span>
                <br />
                <span>{numProducts} Produkte insgesamt</span>
                <br />
                <span>
                  Durchschnittlicher Nutri-Score: {avgNutriScore.toFixed(2)}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Baskets;
