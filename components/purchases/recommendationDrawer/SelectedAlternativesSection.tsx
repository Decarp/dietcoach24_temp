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
    <div className="bg-white border border-gray-300 rounded-md">
      <ProductPopup open={popupOpen} setOpen={handlePopopOpen} />
      <div className="mt-1 flex items-center py-2 px-4 border border-gray-300 border-0 border-b">
        <h3 className="w-full block text-sm font-medium text-gray-500">
          Alternative Produkte
        </h3>
        <div className="relative">
          <ShoppingCartIcon className="h-8 w-8 text-primary" />
          <div className="absolute -top-1.5 -right-2 bg-primary border border-white text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {selectedAlternativeProducts.length}
          </div>
        </div>
        <ArrowUpIcon className="ml-2 h-5 w-5 text-primary" />
      </div>

      <div className="p-4 h-[400px] overflow-y-scroll space-y-4">
        {selectedAlternativeProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Keine Produkte ausgewählt
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bitte wählen Sie Produkte aus, um sie ihrem Kunden
                vorzuschlagen.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => handlePopopOpen(true)}
              >
                <PlusIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                />
                Produkte auswählen
              </button>
            </div>
          </div>
        )}
        {selectedAlternativeProducts.map((product) => (
          <div
            key={product.productId}
            className="flex items-center space-x-4 justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0" />
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
              className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0"
              onClick={() => handleRemoveProduct(product.productId)}
            />
          </div>
        ))}
        {selectedAlternativeProducts.length !== 0 && (
          <div className="text-center">
            <br />
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => handlePopopOpen(true)}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              Produkte auswählen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
