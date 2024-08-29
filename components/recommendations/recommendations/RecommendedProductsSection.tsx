import DatabaseProductCard from "@/components/DatabaseProductCard";
import { DatabaseProduct } from "@/types/types";
import { ArrowDownIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function RecommendedProductsSection({
  products,
}: {
  products: DatabaseProduct[];
}) {
  return (
    <div className="bg-white border border-gray-300 rounded-md">
      <div className="mt-1 flex items-center py-2 px-4 border border-gray-300 border-0 border-b">
        <h3 className="w-full block text-sm font-medium text-gray-500">
          Gekaufte Produkte
        </h3>
        <div className="relative">
          <ShoppingCartIcon className="h-8 w-8 text-red-500" />
          <div className="absolute -top-1.5 -right-2 bg-red-500 border border-white text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {products.length}
          </div>
        </div>
        <ArrowDownIcon className="ml-2 h-5 w-5 text-red-500" />
      </div>

      <div className="max-h-[320px] overflow-y-scroll shadow-inner border-b border-gray-300">
        {products.length === 0 && (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Keine Produkte ausgewählt
              </h3>
            </div>
          </div>
        )}
        <ul className="divide-y divide-gray-300">
          {products.map((product) => (
            <DatabaseProductCard
              key={product.productId}
              product={product}
              variant="selected"
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
