import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { BasketProductFlat } from "@/types/types";

interface ProductCardProps {
  product: BasketProductFlat;
  handleRemoveSelectedProduct: (gtin: number, basketId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleRemoveSelectedProduct,
}) => {
  return (
    <div
      key={product.gtin}
      className="flex items-center space-x-4 justify-between"
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0"></div>
        <div>
          <h4 className="text-gray-900 font-semibold">{product.name}</h4>
          <p className="text-gray-500">{product.nutrients.nutriScore}</p>
          <p className="text-gray-500">{product.dietCoachCategoryL1.de}</p>
        </div>
      </div>
      <TrashIcon
        className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0"
        onClick={() =>
          handleRemoveSelectedProduct(product.gtin, product.basketId)
        }
      />
    </div>
  );
};

export default ProductCard;
