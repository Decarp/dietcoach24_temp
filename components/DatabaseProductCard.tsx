import React from "react";
import { useCounterStore } from "@/providers/useStoreProvider";
import { DatabaseProduct, DatabaseNutrients } from "@/types/types";
import { classNames } from "@/utils/classNames";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { roundNutrientValue } from "@/utils/roundNutrientValue";

// Define the nutrient mapping for DatabaseProduct
const nutrientKeyMap: { [key: string]: keyof DatabaseNutrients } = {
  Kalorien: "kcal",
  Proteine: "proteins",
  Fette: "fats",
  "Gesättigte Fettsäuren": "saturatedFats",
  Kohlenhydrate: "carbohydrates",
  Zucker: "sugars",
  Nahrungsfasern: "fibers",
  Salz: "salt",
};

// Define NutriScore color mapping
const nutriScoreColorMap: { [key: string]: string } = {
  A: "bg-green-700 border border-green-800 text-white",
  B: "bg-green-500 border border-green-600 text-white",
  C: "bg-yellow-500 border border-yellow-600 text-white",
  D: "bg-orange-500 border border-orange-600 text-white",
  E: "bg-red-600 border border-red-700 text-white",
};

type DatabaseProductCardProps = {
  product: DatabaseProduct;
  selectedNutrient?: string | null;
  variant?: "default" | "selected";
  selectedNutrientColor?: string;
  onRemove?: (gtin: number) => void;
  onAdd?: (product: DatabaseProduct) => void;
};

const DatabaseProductCard: React.FC<DatabaseProductCardProps> = ({
  product,
  variant = "default",
  selectedNutrient,
  selectedNutrientColor,
  onRemove,
  onAdd,
}) => {
  console.log("selectedNutrient", selectedNutrient);

  const { selectedAlternativeProducts } = useCounterStore((state) => state);

  const nutriScoreClass =
    nutriScoreColorMap[product.nutriScoreV2023Detail.nutriScoreCalculated] ||
    "bg-gray-200 text-gray-700";

  const isSelected = selectedAlternativeProducts.some(
    (altProduct) => altProduct.productId === product.productId
  );

  return (
    <li
      key={product.productId}
      className={classNames(
        "pl-6 items-center gap-x-4 px-3 py-5 space-y-4",
        isSelected && variant === "default" ? "bg-primary text-white" : ""
      )}
    >
      <p
        className={classNames(
          "text-base font-semibold leading-6",
          isSelected && variant === "default" ? "text-white" : "text-gray-900"
        )}
      >
        {product.de.name}
      </p>

      <div className="relative flex space-x-4">
        <div className="relative flex-none">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.de.name}
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
              nutriScoreClass
            )}
          >
            {product.nutriScoreV2023Detail.nutriScoreCalculated}
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex-1">
            {/* Loop through all nutrients in the nutrientKeyMap */}
            {Object.entries(nutrientKeyMap).map(([label, key]) => (
              <div
                key={key}
                className={classNames(
                  "text-sm font-normal grid grid-cols-2 gap-x-10",
                  isSelected && variant === "default"
                    ? "text-white"
                    : "text-gray-700",
                  selectedNutrient === label && selectedNutrientColor
                )}
              >
                <p>
                  {label === "Gesättigte Fettsäuren" ? "Ges. Fette" : label}:{" "}
                </p>
                <p className="font-medium">
                  {roundNutrientValue(product.nutrients[key])}
                  {label === "Kalorien" ? (
                    "kcal"
                  ) : (
                    <>
                      g
                      <span
                        className={
                          selectedNutrient === label
                            ? "font-normal"
                            : isSelected
                            ? "font-normal"
                            : "font-normal text-gray-500"
                        }
                      >
                        {" "}
                        / 100g
                      </span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
          {variant === "selected" && onRemove && (
            <TrashIcon
              className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0"
              onClick={() => onRemove(product.productId)}
            />
          )}
          {variant === "default" && onAdd && (
            <div className="ml-4">
              {isSelected ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-white hover:text-gray-200 cursor-pointer flex-shrink-0"
                  onClick={() => onRemove && onRemove(product.productId)}
                />
              ) : (
                <PlusCircleIcon
                  className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer flex-shrink-0"
                  onClick={() => onAdd(product)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default DatabaseProductCard;
