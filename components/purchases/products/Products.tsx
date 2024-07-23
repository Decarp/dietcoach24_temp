import React from "react";
import { CakeIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/classNames";
import ProductsHeader from "@/components/purchases/products/ProductsHeader";
import {
  BasketProductFlat,
  SelectedBasketIds,
  SelectedBasketProductId,
} from "@/app/p/[id]/purchases/page";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const Products = ({
  filteredBasketProductsFlat,
  selectedBasketProductIds,
  handleProductCheckboxChange,
  selectedBasketIds,
}: {
  filteredBasketProductsFlat: BasketProductFlat[];
  selectedBasketProductIds: SelectedBasketProductId[];
  handleProductCheckboxChange: any;
  selectedBasketIds: SelectedBasketIds;
}) => {
  const isProductSelected = (productId: number, basketId: number) =>
    selectedBasketProductIds.some(
      (item) => item.productId === productId && item.basketId === basketId
    );
  console.log("selectedBasketProductIds", selectedBasketProductIds);

  return (
    <div className="pt-6 -mr-8 bg-white border-x flex flex-col shrink-0 border-t border-b border-gray-200 lg:w-96 lg:border-t-0 lg:pr-8 xl:pr-6 max-h-[calc(100vh-187px)]">
      <ProductsHeader
        filteredProducts={filteredBasketProductsFlat}
        selectedBasketIds={selectedBasketIds}
      />

      <div className="-mr-6 flex-1 overflow-y-auto min-h-0 min-h-80 shadow-inner">
        {selectedBasketIds.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-100">
            {filteredBasketProductsFlat.map((product) => {
              const uniqueId = `${product.basketId},${product.productId}`;
              const selected = isProductSelected(
                product.productId,
                product.basketId
              );
              return (
                <li
                  key={uniqueId}
                  className={classNames(
                    "pl-6 flex items-center gap-x-4 px-3 py-5",
                    selected ? "bg-primary text-white" : ""
                  )}
                >
                  <CakeIcon
                    className={classNames(
                      "border border-gray-200 h-20 w-20 p-2 flex-none rounded-md",
                      selected
                        ? "bg-white text-primary"
                        : "bg-gray-50 text-primary"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={classNames(
                        "text-base font-semibold leading-6",
                        selected ? "text-white" : "text-gray-900"
                      )}
                    >
                      {product.name}
                    </p>
                    <p
                      className={classNames(
                        "truncate text-sm leading-5",
                        selected ? "text-white" : "text-gray-500"
                      )}
                    >
                      {product.nutriscore}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 mx-auto mr-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selected}
                    onChange={() =>
                      handleProductCheckboxChange({
                        basketId: product.basketId,
                        productId: product.productId,
                      })
                    }
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-6 mt-6 text-gray-500">
            Bitte wählen Sie mindestens einen Einkauf aus, um die Artikel
            anzuzeigen.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
