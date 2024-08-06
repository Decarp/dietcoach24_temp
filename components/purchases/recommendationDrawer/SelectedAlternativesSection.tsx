// SelectedAlternativesSection.tsx
import {
  ArrowUpIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ProductPopup from "./productPopup/ProductPopup";
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
    <div className="bg-white border rounded-md">
      <ProductPopup open={popupOpen} setOpen={handlePopopOpen} />
      <div className="flex items-center py-2 px-4 border border-0 border-b ">
        <h3 className="w-full block text-sm font-medium text-gray-500">
          Alternative Produkte
        </h3>
        <ShoppingCartIcon className="h-6 w-6 text-primary" />
        <ArrowUpIcon className="ml-1 h-4 w-4 text-primary" />
      </div>
      <div className="p-4 h-[400px] overflow-y-scroll space-y-4">
        {selectedAlternativeProducts.length === 0 && (
          <div className="text-center">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Keine Produkte ausgewählt
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bitte wählen Sie Produkte aus, um sie ihrem Kunden vorzuschlagen.
            </p>
          </div>
        )}
        {selectedAlternativeProducts.map((product) => (
          <div
            key={product.productId}
            className="flex items-center space-x-4 justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-md bg-gray-200"></div>
              <div>
                <h4 className="text-gray-900 font-semibold">
                  {product.de.name}
                </h4>
                <p className="text-gray-500">
                  {product.nutriScoreV2023Detail.nutriScoreCalculated}
                </p>
                <p className="text-gray-500">
                  {product.dietCoachCategoryL1.de}
                </p>
              </div>
            </div>
            <TrashIcon
              className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={() => handleRemoveProduct(product.productId)}
            />
          </div>
        ))}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => handlePopopOpen(true)}
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
            Produkte auswählen
          </button>
        </div>
      </div>
    </div>
  );
}
