import React from "react";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProductFlat } from "@/types/types";

const ProductsHeader = ({ products }: { products: BasketProductFlat[] }) => {
  const { selectedBasketIds } = useCounterStore((state) => state);
  return (
    <>
      <h2 className="pl-6 text-xl font-semibold">Lebensmittel</h2>
      <h3 className="pl-6 text-xs font-light mb-5 text-gray-500">
        {products.length} gefilterte Lebensmittel aus {selectedBasketIds.length}{" "}
        {selectedBasketIds.length === 1 ? "Einkauf" : "Einkäufen"}
      </h3>
    </>
  );
};

export default ProductsHeader;
