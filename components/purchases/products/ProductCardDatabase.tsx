"use client";

import { DatabaseProduct } from "@/types/types";

const ProductCardDatabase = ({
  product,
}: {
  product: DatabaseProduct | undefined;
}) => {
  if (!product) {
    return (
      <li className="flex items-center gap-4">
        <div className="flex-none">
          <div className="text-xs text-gray-500 border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex items-center justify-center rounded-md object-contain">
            Kein Bild
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold leading-6 text-gray-900">
            Produkt nicht gefunden
          </p>
        </div>
      </li>
    );
  }

  return (
    <li key={product.gtins[0]} className="flex items-center gap-4">
      <div className="flex-none">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.de.name}
            className="border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex-none rounded-md object-contain rounded-md"
          />
        ) : (
          <div className="text-xs text-gray-500 border border-gray-300 bg-gray-50 h-20 w-20 p-2 flex items-center justify-center rounded-md object-contain">
            Kein Bild
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold leading-6 text-gray-900">
          {product.de.name}
        </p>
        <p className="truncate text-sm leading-5 text-gray-500">
          {product.nutriScoreV2023Detail.nutriScoreCalculated}
        </p>
      </div>
    </li>
  );
};

export default ProductCardDatabase;
