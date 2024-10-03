import ProductCard from "@/components/ProductCard";
import ProductsHeader from "@/components/purchases/products/ProductsHeader";
import { Spinner } from "@/components/Spinner";
import { sortCriteria } from "@/data/sortCriteria";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProduct, BasketProductFlat } from "@/types/types";
import { fetchBasketProducts } from "@/utils/fetchBasketProducts";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RecommendationDrawer from "../recommendationDrawer/RecommendationDrawer";
import FilterPopover from "./FilterPopover";
import SortMenu from "./SortMenu";
import { categories } from "@/data/categories";

const sortProducts = (
  products: BasketProductFlat[],
  selectedSortCriteria: string,
  ascending: boolean
) => {
  const getSortValue = (product: BasketProductFlat) => {
    switch (selectedSortCriteria) {
      case "Menge":
        return product.quantity;
      case "Kalorien":
        return product.nutrients.kcal;
      case "Proteine":
        return product.nutrients.proteins;
      case "Fette":
        return product.nutrients.fats;
      case "Gesättigte Fettsäuren":
        return product.nutrients.saturatedFats;
      case "Kohlenhydrate":
        return product.nutrients.carbohydrates;
      case "Zucker":
        return product.nutrients.sugars;
      case "Nahrungsfasern":
        return product.nutrients.fibres;
      case "Salz":
        return product.nutrients.salt;
      default:
        return product.basketIndex;
    }
  };

  return [...products].sort((a, b) => {
    const aValue = getSortValue(a);
    const bValue = getSortValue(b);

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    return ascending ? aValue - bValue : bValue - aValue;
  });
};

const groupProductsByGtin = (
  products: BasketProductFlat[]
): BasketProductFlat[] => {
  const grouped = products.reduce((acc, product) => {
    const gtin = product.gtin;
    if (!acc[gtin]) {
      acc[gtin] = { ...product };
    } else {
      acc[gtin].quantity += product.quantity;
    }
    return acc;
  }, {} as { [gtin: number]: BasketProductFlat });
  return Object.values(grouped);
};

const Products = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const [ascending, setAscending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    hideProducts,
    selectedBasketIds,
    selectedCategories,
    selectedSortCriteria,
    selectedBasketProductIds,
    setSelectedSortCriteria,
    basketProducts,
    basketProductsFlat,
    setBasketProductsFlat,
    highlightBorder,
  } = useCounterStore((state) => state);

  const { isLoading } = useQuery<BasketProduct[]>({
    queryKey: ["basketProducts", selectedBasketIds],
    queryFn: () =>
      fetchBasketProducts(
        patientId,
        selectedBasketIds,
        session?.accessToken || ""
      ),
    enabled: selectedBasketIds.length > 0 && !!session?.accessToken,
  });

  const newBasketProductsFlat: BasketProductFlat[] = basketProducts.flatMap(
    (basket) => {
      return basket.products.map((product) => ({
        basketId: basket.basketId,
        basketIndex: basket.index,
        basketTimestamp: basket.timestamp,
        ...product,
      }));
    }
  );

  useEffect(() => {
    if (
      JSON.stringify(newBasketProductsFlat) !==
      JSON.stringify(basketProductsFlat)
    ) {
      setBasketProductsFlat(newBasketProductsFlat);
    }
  }, [newBasketProductsFlat, basketProductsFlat, setBasketProductsFlat]);

  const filteredProducts =
    selectedCategories.major.length === 0 && selectedCategories.sub.length === 0
      ? []
      : basketProductsFlat.filter(
          (product) =>
            (selectedCategories.major.length === 0 ||
              selectedCategories.major.includes(
                product.dietCoachCategoryL1.de
              )) &&
            (selectedCategories.sub.length === 0 ||
              selectedCategories.sub.includes(product.dietCoachCategoryL2.de))
        );

  const groupedProducts = groupProductsByGtin(filteredProducts);

  const sortedProducts = sortProducts(
    groupedProducts,
    selectedSortCriteria,
    ascending
  );

  useEffect(() => {
    if (!sortCriteria.includes(selectedSortCriteria)) {
      setSelectedSortCriteria(selectedSortCriteria);
    }
  }, [selectedSortCriteria, setSelectedSortCriteria]);

  const handleDrawerOpen = (open: boolean) => {
    setDrawerOpen(open);
  };

  const categoriesWithSub: { major: string; subs: string[] }[] = Object.entries(
    categories.de
  ).map(([major, subs]) => ({
    major,
    subs,
  }));

  return (
    <div
      className={`relative pt-6 -mr-8 bg-white border-r flex flex-col shrink-0 border-t border-b border-gray-300 min-w-60 md:max-w-96 xl:w-96 lg:border-t-0 lg:pr-8 xl:pr-6 h-[calc(100vh-185px)] ${
        hideProducts ? "hidden" : ""
      }`}
    >
      <ProductsHeader products={sortedProducts} />

      <div className="border-b border-gray-300 px-6 -mt-[7px] -mr-6 pb-2 flex gap-x-8 items-center">
        <FilterPopover
          categoriesWithSub={categoriesWithSub}
          selectedCategories={selectedCategories}
        />

        <SortMenu
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

      <div className="-mr-6 flex-1 overflow-y-auto min-h-0 shadow-inner border-b border-gray-300">
        {isLoading && <Spinner />}
        {selectedCategories.major.length === 0 &&
          !isLoading &&
          selectedCategories.sub.length === 0 && (
            <div className="flex mt-6 px-4">
              <ArrowUpIcon className="ml-3 h-12 w-12 text-gray-400 mr-6 flex-shrink-0" />
              <div className="text-center">
                <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Keine Lebensmittelkategorie ausgewählt
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bitte wählen Sie mindestens eine Lebensmittelkategorie aus, um
                  die Lebensmittel anzuzeigen.
                </p>
              </div>
            </div>
          )}
        <ul
          role="list"
          className={`divide-y divide-gray-300 ${
            highlightBorder ? "border-4 border-orange-500" : ""
          }`}
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.gtin} product={product} />
          ))}
        </ul>
      </div>

      {(selectedCategories.major.length !== 0 ||
        selectedCategories.sub.length !== 0) && (
        <div className="flex justify-end p-6">
          <button
            type="button"
            onClick={() => handleDrawerOpen(true)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-green-700"
          >
            {selectedBasketProductIds.length === 0
              ? "Empfehlung erstellen"
              : `Empfehlung erstellen (${selectedBasketProductIds.length})`}
          </button>
        </div>
      )}
      <RecommendationDrawer open={drawerOpen} setOpen={handleDrawerOpen} />
    </div>
  );
};

export default Products;
