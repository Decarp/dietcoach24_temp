import { useCounterStore } from "@/providers/useStoreProvider";
import {
  ArrowDownIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function SelectedProductsSection() {
  const {
    selectedBasketProductsFlat,
    setSelectedBasketProductIds,
    setSelectedBasketProductsFlat,
    selectedBasketProductIds,
  } = useCounterStore((state) => state);

  const handleRemoveProduct = (gtin: number, basketId: string) => {
    const newSelectedBasketProductsFlat = selectedBasketProductsFlat.filter(
      (product) => !(product.gtin === gtin && product.basketId === basketId)
    );
    setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);

    const newSelectedBasketProductIds = selectedBasketProductIds.filter(
      (id) => !(id.gtin === gtin && id.basketId === basketId)
    );
    setSelectedBasketProductIds(newSelectedBasketProductIds);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md">
      <div className="mt-1 flex items-center py-2 px-4 border border-gray-300 border-0 border-b">
        <h3 className="w-full block text-sm font-medium text-gray-500">
          Gekaufte Produkte
        </h3>
        <div className="relative">
          <ShoppingCartIcon className="h-8 w-8 text-red-500" />
          <div className="absolute -top-1.5 -right-2 bg-red-500 border border-white text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {selectedBasketProductsFlat.length}
          </div>
        </div>
        <ArrowDownIcon className="ml-2 h-5 w-5 text-red-500" />
      </div>
      <div className="p-4 h-[400px] overflow-y-scroll">
        {selectedBasketProductsFlat.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Keine Produkte ausgewählt
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bitte wählen Sie gekaufte Produkte aus den Einkäufen Ihres
                Kunden aus, zu denen Sie ihrem Kunden Empfehlungen geben
                möchten.
              </p>
            </div>
          </div>
        )}
        {selectedBasketProductsFlat.map((product) => (
          <div
            key={product.gtin}
            className="flex items-center space-x-4 justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0" />
              <div>
                <h4 className="text-gray-900 font-semibold">{product.name}</h4>
                <p className="text-gray-500">{product.nutrients.nutriScore}</p>
                <p className="text-gray-500">
                  {product.dietCoachCategoryL1.de}
                </p>
              </div>
            </div>
            <TrashIcon
              className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0"
              onClick={() =>
                handleRemoveProduct(product.gtin, product.basketId)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
