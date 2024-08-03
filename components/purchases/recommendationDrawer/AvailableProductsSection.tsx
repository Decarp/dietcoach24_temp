// AvailableProductsSection.tsx
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Product, Products } from "@/types/types";
import { useEffect, useState } from "react";
import FilterPopover from "../products/FilterPopover";
import SortMenu from "../products/SortMenu";
import { categories } from "@/data/categories";
import { useCounterStore } from "@/providers/useStoreProvider";
import { sortCriteria } from "../products/Products";

export default function AvailableProductsSection() {
  const [ascending, setAscending] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const categoriesWithSub: { major: string; subs: string[] }[] = Object.entries(
    categories.de
  ).map(([major, subs]) => ({
    major,
    subs,
  }));

  const {
    selectedCategories,
    selectedSortCriteria,
    setSelectedSortCriteria,
    updateCategories,
  } = useCounterStore((state) => state);

  console.log("selectedCategories", selectedCategories);

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const response = await fetch("/api");
        const data: Products = await response.json();
        setAvailableProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch available products:", error);
      }
    };

    fetchAvailableProducts();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h3 className="block text-md font-base text-gray-500">
        Artikelauswahl für Alternativen
      </h3>
      <div className="px-6 -mt-2 pb-2 flex gap-x-8 items-center">
        <FilterPopover
          categoriesWithSub={categoriesWithSub}
          selectedCategories={selectedCategories}
          updateCategories={updateCategories}
        />

        <SortMenu
          sortCriteria={sortCriteria}
          selectedSortCriteria={selectedSortCriteria}
          setSelectedSortCriteria={setSelectedSortCriteria}
        />

        <div>
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setAscending(!ascending)}
          >
            {ascending ? (
              <ArrowUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      <div className="overflow-y-scroll">
        {availableProducts.map((product) => (
          <div key={product.productId} className="flex items-center space-x-4">
            <ArrowLeftIcon className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
            <Image
              src={product.imageUrl}
              alt={product.de.name}
              className="w-16 h-16 rounded-md"
              width={64}
              height={64}
            />
            <div>
              <h4 className="text-gray-900 font-semibold">{product.de.name}</h4>
              <p className="text-gray-500">{product.dietCoachCategoryL1.de}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
