import DatabaseProductCard from "@/components/DatabaseProductCard";
import { useCounterStore } from "@/providers/useStoreProvider";
import {
  ArrowUpIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ProductPopup from "./productPopup/ProductPopup";

export default function SelectedAlternativesSection() {
  const [popupOpen, setPopupOpen] = useState(false);
  const handlePopopOpen = (open: boolean) => {
    setPopupOpen(open);
  };

  const { selectedAlternativeProducts, setSelectedAlternativeProducts } =
    useCounterStore((state) => state);

  const handleRemoveProduct = (gtin: number) => {
    setSelectedAlternativeProducts(
      selectedAlternativeProducts.filter(
        (product) => product.productId !== gtin
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

      <div className="h-[320px] overflow-y-scroll shadow-inner border-b border-gray-300">
        {selectedAlternativeProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-4">
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
          </div>
        )}

        <ul className="divide-y divide-gray-300">
          {selectedAlternativeProducts.map((product) => (
            <DatabaseProductCard
              key={product.productId}
              product={product}
              variant="selected"
              onRemove={handleRemoveProduct}
            />
          ))}
        </ul>
      </div>

      <div className="flex justify-center p-4">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => handlePopopOpen(true)}
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
          Produkte auswählen
        </button>
      </div>
    </div>
  );
}
