import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import { useCounterStore } from '@/providers/useStoreProvider';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function SelectedProductsSection({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const {
        selectedBasketProductsFlat,
        setSelectedBasketProductIds,
        setSelectedBasketProductsFlat,
        selectedBasketProductIds,
        setHighlightBorder,
    } = useCounterStore((state) => state);

    const handleRemoveProduct = (gtin: number, basketId: string) => {
        const newSelectedBasketProductsFlat = selectedBasketProductsFlat.filter(
            (product) => !(product.gtin === gtin && product.basketId === basketId),
        );
        setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);

        const newSelectedBasketProductIds = selectedBasketProductIds.filter(
            (id) => !(id.gtin === gtin && id.basketId === basketId),
        );
        setSelectedBasketProductIds(newSelectedBasketProductIds);
    };

    return (
        <div className="bg-white border border-gray-300 rounded-md">
            <div className="mt-1 flex items-center py-2 px-4 border border-gray-300 border-0 border-b">
                <h3 className="w-full block text-sm font-medium text-gray-500">Gekaufte Produkte</h3>
                <div className="relative mr-2">
                    <ShoppingCartIcon className="h-8 w-8 text-red-500" />
                    <div className="absolute -top-1.5 -right-2 bg-red-500 border border-white text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {selectedBasketProductsFlat.length}
                    </div>
                </div>
            </div>

            <div className="h-[320px] overflow-y-scroll shadow-inner border-b border-gray-300">
                {selectedBasketProductsFlat.length === 0 && (
                    <div className="flex items-center justify-center h-full p-4">
                        <div className="text-center">
                            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-6 text-sm font-semibold text-gray-900">Keine Produkte ausgewählt</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Wählen Sie gekaufte Produkte aus den Einkäufen Ihres Kunden aus, zu denen Sie ihrem
                                Kunden Empfehlungen geben möchten.
                            </p>
                        </div>
                    </div>
                )}
                <ul className="divide-y divide-gray-300">
                    {selectedBasketProductsFlat.map((product) => (
                        <ProductCard
                            key={`${product.basketId},${product.gtin}`}
                            product={product}
                            variant="selected"
                            onRemove={handleRemoveProduct}
                        />
                    ))}
                </ul>
            </div>

            <div className="flex justify-center p-4">
                <Button
                    onClick={() => {
                        setOpen(false);
                        setHighlightBorder(true);
                    }}
                    icon={<PlusIcon className="h-5 w-5" />}
                >
                    Gekaufte Produkte auswählen
                </Button>
            </div>
        </div>
    );
}
