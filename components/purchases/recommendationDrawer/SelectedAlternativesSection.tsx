import DatabaseProductCard from "@/components/DatabaseProductCard";
import { useCounterStore } from "@/providers/useStoreProvider";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ProductPopup from "@/components/purchases/productPopup/ProductPopup";
import Button from "@/components/Button";

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
        (product) => product.productId !== gtin,
      ),
    );
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md">
      <ProductPopup open={popupOpen} setOpen={handlePopopOpen} />
      <div className="mt-1 flex items-center py-2 px-4 border border-gray-300 border-0 border-b">
        <h3 className="w-full block text-sm font-medium text-gray-500">
          Alternative Produkte
        </h3>
        <div className="relative mr-2">
          <ShoppingCartIcon className="h-8 w-8 text-primary" />
          <div className="absolute -top-1.5 -right-2 bg-primary border border-white text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {selectedAlternativeProducts.length}
          </div>
        </div>
      </div>

      <div className="h-[320px] overflow-y-scroll shadow-inner border-b border-gray-300">
        {selectedAlternativeProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-6 text-sm font-semibold text-gray-900">
                Keine Produkte ausgewählt
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Wählen Sie Produkte aus, um sie ihrem Kunden vorzuschlagen.
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
        <Button
          onClick={() => handlePopopOpen(true)}
          icon={<PlusIcon className="h-5 w-5" />}
        >
          Alternative Produkte auswählen
        </Button>
      </div>
    </div>
  );
}
