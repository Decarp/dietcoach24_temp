// SelectedProductsSection.tsx
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

  const handleRemoveProduct = (productId: number, basketId: number) => {
    const newSelectedBasketProductsFlat = selectedBasketProductsFlat.filter(
      (product) =>
        !(product.productId === productId && product.basketId === basketId)
    );
    setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);

    const newSelectedBasketProductIds = selectedBasketProductIds.filter(
      (id) => !(id.productId === productId && id.basketId === basketId)
    );
    setSelectedBasketProductIds(newSelectedBasketProductIds);
  };

  return (
    <div className="bg-white border rounded-md">
      <div className="flex items-center py-2 px-4 border border-0 border-b ">
        <h3 className="w-full block text-sm font-medium text-gray-500">
          Gekaufte Produkte
        </h3>
        <ShoppingCartIcon className="h-6 w-6 text-red-500" />
        <ArrowDownIcon className="ml-1 h-4 w-4 text-red-500" />
      </div>
      <div className="p-4 h-[400px] overflow-y-scroll space-y-4">
        {selectedBasketProductsFlat.length === 0 && (
          <div className="text-center">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Keine Produkte ausgewählt
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bitte wählen Sie Produkte aus, zu denen Sie ihrem Kunden
              Empfehlungen geben möchten.
            </p>
          </div>
        )}
        {selectedBasketProductsFlat.map((product) => (
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
              onClick={() =>
                handleRemoveProduct(product.productId, product.basketId)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
