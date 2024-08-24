"use client";

import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProductFlat, SelectedBasketProductId } from "@/types/types";
import { classNames } from "@/utils/classNames";
import React from "react";

const ProductCard = ({ product }: { product: BasketProductFlat }) => {
  const uniqueId = `${product.basketId},${product.gtin}`;

  const {
    selectedBasketProductIds,
    setSelectedBasketProductIds,
    selectedBasketProductsFlat,
    setSelectedBasketProductsFlat,
  } = useCounterStore((state) => state);

  const isProductSelected = (gtin: number, basketId: string) =>
    selectedBasketProductIds.some(
      (item) => item.gtin === gtin && item.basketId === basketId
    );

  const handleProductCheckboxChange = (
    selectedBasketProductId: SelectedBasketProductId
  ) => {
    if (
      isProductSelected(
        selectedBasketProductId.gtin,
        selectedBasketProductId.basketId
      )
    ) {
      const newSelectedBasketProductIds = selectedBasketProductIds.filter(
        (product) =>
          product.gtin !== selectedBasketProductId.gtin &&
          product.basketId !== selectedBasketProductId.basketId
      );

      setSelectedBasketProductIds(newSelectedBasketProductIds);

      const newSelectedBasketProductsFlat = selectedBasketProductsFlat.filter(
        (product) =>
          product.gtin !== selectedBasketProductId.gtin &&
          product.basketId !== selectedBasketProductId.basketId
      );

      setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);
    } else {
      const newSelectedBasketProductIds = [
        ...selectedBasketProductIds,
        selectedBasketProductId,
      ];

      setSelectedBasketProductIds(newSelectedBasketProductIds);

      const newSelectedBasketProductsFlat = [
        ...selectedBasketProductsFlat,
        product,
      ];

      setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);
    }
  };

  const selected = isProductSelected(product.gtin, product.basketId);

  return (
    <li
      key={uniqueId}
      className={classNames(
        "pl-6 flex items-center gap-x-4 px-3 py-5",
        selected ? "bg-primary text-white" : ""
      )}
    >
      <div className="flex-none">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex-none rounded-md object-contain rounded-md"
          />
        ) : (
          <div className="text-xs text-gray-500 border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex items-center justify-center rounded-md object-contain">
            Kein Bild
          </div>
        )}
      </div>
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
            gtin: product.gtin,
          })
        }
      />
    </li>
  );
};

export default ProductCard;
