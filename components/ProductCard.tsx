import React from "react";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProductFlat, Nutrients } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { TrashIcon } from "@heroicons/react/24/outline";
import { nutriScoreColorMap } from "@/constants/nutriScoreColorMap";

export const nutrientKeyMap: { [key: string]: keyof Nutrients } = {
  Kalorien: "kcal",
  Proteine: "proteins",
  Fette: "fats",
  "Gesättigte Fettsäuren": "saturatedFats",
  Kohlenhydrate: "carbohydrates",
  Zucker: "sugars",
  Nahrungsfasern: "fibres",
  Salz: "salt",
};

type ProductCardProps = {
  product: BasketProductFlat;
  variant?: "default" | "selected";
  onRemove?: (gtin: number, basketId: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = "default",
  onRemove,
}) => {
  const {
    selectedBasketProductIds,
    setSelectedBasketProductIds,
    selectedBasketProductsFlat,
    setSelectedBasketProductsFlat,
    selectedSortCriteria,
  } = useCounterStore((state) => state);

  const isProductSelected = (gtin: number) =>
    selectedBasketProductIds.some((item) => item.gtin === gtin);

  const handleProductCheckboxChange = () => {
    if (isProductSelected(product.gtin)) {
      const newSelectedBasketProductIds = selectedBasketProductIds.filter(
        (item) => item.gtin !== product.gtin,
      );
      setSelectedBasketProductIds(newSelectedBasketProductIds);

      const newSelectedBasketProductsFlat = selectedBasketProductsFlat.filter(
        (p) => p.gtin !== product.gtin,
      );
      setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);
    } else {
      const selectedBasketProductId = {
        basketId: product.basketId,
        gtin: product.gtin,
      };

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

  const selected = isProductSelected(product.gtin);

  const nutrientKey = nutrientKeyMap[selectedSortCriteria];
  const nutrientValue = nutrientKey
    ? product.nutrients[nutrientKey]
    : undefined;
  const roundedNutrientValue =
    typeof nutrientValue === "number"
      ? nutrientValue.toFixed(0)
      : nutrientValue || "N/A";

  const nutriScoreClass =
    nutriScoreColorMap[product.nutrients.nutriScore] ||
    "bg-gray-200 text-gray-700";

  return (
    <li
      key={product.gtin}
      className={classNames(
        "pl-6 flex items-center gap-x-4 px-3 py-5",
        selected && variant === "default" ? "bg-primary text-white" : "",
      )}
    >
      <div className="relative flex-none">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex-none rounded-md object-contain"
          />
        ) : (
          <div className="text-xs text-gray-500 border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex items-center justify-center rounded-md">
            Kein Bild
          </div>
        )}
        <div
          className={classNames(
            "shadow absolute top-0 -m-2 right-0 inline-flex items-center rounded-md px-1 text-xs font-medium",
            nutriScoreClass,
          )}
        >
          {product.nutrients.nutriScore}
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex-1">
          <p
            className={classNames(
              "text-base font-semibold leading-6",
              selected && variant === "default"
                ? "text-white"
                : "text-gray-900",
            )}
          >
            {product.name}
          </p>
          <p
            className={classNames(
              "text-sm font-normal leading-6",
              selected && variant === "default"
                ? "text-white"
                : "text-gray-700",
            )}
          >
            Menge:{" "}
            <span className="font-medium">
              {Number.isInteger(product.quantity)
                ? product.quantity
                : product.quantity.toFixed(2)}
              {Number.isInteger(product.quantity) ? "" : " kg"}
            </span>
          </p>
          {selectedSortCriteria !== "Menge" && (
            <p
              className={classNames(
                "text-sm font-normal leading-6",
                selected && variant === "default"
                  ? "text-white"
                  : "text-gray-700",
              )}
            >
              {selectedSortCriteria}:{" "}
              <span className="font-medium">
                {roundedNutrientValue}
                {nutrientKey === "kcal" ? " kcal" : "g / 100g"}
              </span>
            </p>
          )}
        </div>
        {variant === "selected" && onRemove && (
          <TrashIcon
            className="h-6 w-6 mr-4 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0"
            onClick={() => onRemove(product.gtin, product.basketId)}
          />
        )}
      </div>

      {variant === "default" && (
        <input
          type="checkbox"
          className="h-4 w-4 mx-auto mr-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          checked={selected}
          onChange={handleProductCheckboxChange}
        />
      )}
    </li>
  );
};

export default ProductCard;
