import React from "react";
import { useCounterStore } from "@/providers/useStoreProvider";

const ProductsHeader = ({ filteredProducts }: { filteredProducts: any }) => {
  const { selectedBasketIds } = useCounterStore((state) => state);
  return (
    <>
      <h2 className="pl-6 text-xl font-semibold">Artikel</h2>
      <h3 className="pl-6 text-sm font-light mb-4 text-gray-500">
        Zeige {Object.values(filteredProducts).flat().length} selektierte
        Artikel aus {selectedBasketIds.length}{" "}
        {selectedBasketIds.length === 1 ? "Einkauf" : "Einkäufen"}
      </h3>
    </>
  );
};

export default ProductsHeader;
