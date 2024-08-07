import React from "react";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProductFlat } from "@/types/types";

const ProductsHeader = ({ products }: { products: BasketProductFlat[] }) => {
  const { selectedBasketIds } = useCounterStore((state) => state);
  return (
    <>
      <h2 className="pl-6 text-xl font-semibold">Artikel</h2>
      <h3 className="pl-6 text-sm font-light mb-4 text-gray-500">
        {products.length} selektierte Artikel aus {selectedBasketIds.length}{" "}
        {selectedBasketIds.length === 1 ? "Einkauf" : "Einkäufen"}
      </h3>
    </>
  );
};

export default ProductsHeader;
