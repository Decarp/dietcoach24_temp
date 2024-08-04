// SelectedProductsSection.tsx
import { useCounterStore } from "@/providers/useStoreProvider";
import { TrashIcon } from "@heroicons/react/24/outline";

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
    <div className="bg-white p-4 border rounded-md h-[420px] overflow-y-scroll space-y-4">
      <h3 className="block text-md font-base text-gray-500">
        Selektierte gekaufte Artikel
      </h3>
      {selectedBasketProductsFlat.length === 0 && (
        <p className="text-gray-500">Keine Artikel ausgewählt</p>
      )}
      {selectedBasketProductsFlat.map((product) => (
        <div
          key={product.productId}
          className="flex items-center space-x-4 justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-md bg-gray-200"></div>

            <div>
              <h4 className="text-gray-900 font-semibold">{product.de.name}</h4>
              <p className="text-gray-500">{product.dietCoachCategoryL1.de}</p>
            </div>
          </div>
          <TrashIcon
            className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
            onClick={() =>
              handleRemoveProduct(product.productId, product.basketId)
            }
          />
        </div>
      ))}
    </div>
  );
}
