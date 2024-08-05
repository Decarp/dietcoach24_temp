// SelectedAlternativesSection.tsx
import { TrashIcon } from "@heroicons/react/24/outline";
import ProductPopup from "./productPopup.tsx/ProductPopup";
import { useState } from "react";
import { useCounterStore } from "@/providers/useStoreProvider";

export default function SelectedAlternativesSection() {
  const [popupOpen, setPopupOpen] = useState(false);
  const handlePopopOpen = (open: boolean) => {
    setPopupOpen(open);
  };

  const { selectedAlternativeProducts, setSelectedAlternativeProducts } =
    useCounterStore((state) => state);

  const handleRemoveProduct = (productId: number) => {
    setSelectedAlternativeProducts(
      selectedAlternativeProducts.filter(
        (product) => product.productId !== productId
      )
    );
  };

  return (
    <div className="bg-white p-4 border rounded-md h-[420px] overflow-y-scroll space-y-4">
      <ProductPopup open={popupOpen} setOpen={handlePopopOpen} />
      <h3 className="block text-md font-base text-gray-500">
        Selektierte alternative Artikel
      </h3>
      {selectedAlternativeProducts.map((product) => (
        <div
          key={product.productId}
          className="flex items-center space-x-4 justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-md bg-gray-200"></div>
            <div>
              <h4 className="text-gray-900 font-semibold">{product.de.name}</h4>
              <p className="text-gray-500">
                {product.nutriScoreV2023Detail.nutriScoreCalculated}
              </p>
              <p className="text-gray-500">{product.dietCoachCategoryL1.de}</p>
            </div>
          </div>
          <TrashIcon
            className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
            onClick={() => handleRemoveProduct(product.productId)}
          />
        </div>
      ))}
      <button
        className="col-span-1 bg-white border rounded-md px-4 mx-auto"
        onClick={() => handlePopopOpen(true)}
      >
        Add products
      </button>
    </div>
  );
}
