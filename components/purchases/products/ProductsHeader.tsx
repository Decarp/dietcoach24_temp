import { SelectedBasketIds } from "@/app/p/[id]/purchases/page";
import React from "react";

const ProductsHeader = ({
  filteredProducts,
  selectedBasketIds,
}: {
  filteredProducts: any;
  selectedBasketIds: SelectedBasketIds;
}) => {
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
