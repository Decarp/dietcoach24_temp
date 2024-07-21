import React from "react";
import { CakeIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/classNames";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const Products = ({
  filteredProducts,
  checkedProducts,
  handleProductCheckboxChange,
  checkedBaskets,
}: {
  filteredProducts: any;
  checkedProducts: any;
  handleProductCheckboxChange: any;
  checkedBaskets: any;
}) => {
  // Get the basket indices sorted in descending order
  const sortedBasketIndices = Object.keys(filteredProducts)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="flex flex-col shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
      <h2 className="text-xl font-semibold">Artikel</h2>
      <h3 className="text-sm font-light mb-4 text-gray-500">
        Zeige {Object.values(filteredProducts).flat().length} Artikel
      </h3>

      <div className="-ml-6">
        <nav aria-label="Products List" className="overflow-y-auto">
          {sortedBasketIndices
            .filter((basketIndex) =>
              checkedBaskets.includes(
                filteredProducts[basketIndex][0]?.basketId
              )
            )
            .map((basketIndex) => {
              const firstProduct = filteredProducts[basketIndex][0];
              const timestamp = firstProduct
                ? formatDate(firstProduct.timestamp)
                : "";
              return (
                <div key={basketIndex} className="relative">
                  <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                    Einkauf {basketIndex}
                    <span className="text-sm font-normal text-gray-400">
                      {" "}
                      - {timestamp}
                    </span>
                  </div>
                  <ul role="list" className="divide-y divide-gray-100">
                    {filteredProducts[basketIndex].map((product: any) => {
                      const uniqueId = `${product.basketId},${product.productId}`;
                      return (
                        <li
                          key={uniqueId}
                          className={classNames(
                            "pl-6 flex items-center gap-x-4 px-3 py-5",
                            checkedProducts.includes(uniqueId)
                              ? "bg-primary text-white"
                              : ""
                          )}
                        >
                          <CakeIcon
                            className={classNames(
                              "border border-gray-200 h-20 w-20 p-2 flex-none rounded-md",
                              checkedProducts.includes(uniqueId)
                                ? "bg-white text-primary"
                                : "bg-gray-50 text-primary"
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={classNames(
                                "text-base font-semibold leading-6",
                                checkedProducts.includes(uniqueId)
                                  ? "text-white"
                                  : "text-gray-900"
                              )}
                            >
                              {product.name}
                            </p>
                            <p
                              className={classNames(
                                "truncate text-sm leading-5",
                                checkedProducts.includes(uniqueId)
                                  ? "text-white"
                                  : "text-gray-500"
                              )}
                            >
                              {product.nutriscore}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            className="ml-auto mr-2 rounded-sm form-checkbox h-5 w-5 text-primary"
                            checked={checkedProducts.includes(uniqueId)}
                            onChange={() =>
                              handleProductCheckboxChange(uniqueId)
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </nav>

        {/* DEBUG: Selected uniqueIds */}
        <pre className="ml-4 mt-4">
          [DEBUG] Selected uniqueIds: {JSON.stringify(checkedProducts, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Products;
