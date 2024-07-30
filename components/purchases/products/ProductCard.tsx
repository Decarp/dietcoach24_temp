"use client";

import type {
  BasketProductFlat,
  SelectedBasketProductId,
} from "@/app/p/[id]/purchases/page";
import { useCounterStore } from "@/providers/useStoreProvider";
import { classNames } from "@/utils/classNames";
import { CakeIcon } from "@heroicons/react/24/outline";
import React from "react";

interface ProductCardProps {
  product: BasketProductFlat;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const uniqueId = `${product.basketId},${product.productId}`;

  const { selectedBasketProductIds, setSelectedBasketProductIds } =
    useCounterStore((state) => state);

  const isProductSelected = (productId: number, basketId: number) =>
    selectedBasketProductIds.some(
      (item) => item.productId === productId && item.basketId === basketId
    );

  const handleProductCheckboxChange = (
    selectedBasketProductId: SelectedBasketProductId
  ) => {
    if (
      isProductSelected(
        selectedBasketProductId.productId,
        selectedBasketProductId.basketId
      )
    ) {
      setSelectedBasketProductIds(
        selectedBasketProductIds.filter(
          (product) =>
            product.productId !== selectedBasketProductId.productId &&
            product.basketId !== selectedBasketProductId.basketId
        )
      );
    } else {
      setSelectedBasketProductIds([
        ...selectedBasketProductIds,
        selectedBasketProductId,
      ]);
    }
  };

  const selected = isProductSelected(product.productId, product.basketId);

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
          selected ? "bg-white text-primary" : "bg-gray-50 text-primary"
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
          {product.nutrients.nutriScore}
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
};

export default ProductCard;
