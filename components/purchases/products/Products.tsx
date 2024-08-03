import { getBasketProducts } from "@/api/getBasketProducts";
import ProductsHeader from "@/components/purchases/products/ProductsHeader";
import { useCounterStore } from "@/providers/useStoreProvider";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import RecommendationDrawer from "../recommendationDrawer/RecommendationDrawer";
import { BasketProductFlat } from "@/types/types";
import FilterPopover from "./FilterPopover";
import SortMenu from "./SortMenu";

export const sortCriteria = [
  "Einkaufsdatum",
  "Kalorien",
  "Proteine",
  "Fette",
  "Kohlenhydrate",
  "Nahrungsfasern",
];

const Products = () => {
  const [ascending, setAscending] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const {
    selectedBasketIds,
    selectedCategories,
    selectedSortCriteria,
    setSelectedSortCriteria,
    basketProductsFlat,
    setBasketProductsFlat,
    updateCategories,
  } = useCounterStore((state) => state);

  const basketProductsResponse = getBasketProducts(selectedBasketIds);

  const newBasketProductsFlat: BasketProductFlat[] =
    basketProductsResponse.flatMap((basket) => {
      return basket.products.map((product) => ({
        basketId: basket.basketId,
        basketIndex: basket.index,
        basketTimestamp: basket.timestamp,
        ...product,
      }));
    });

  useEffect(() => {
    if (
      JSON.stringify(newBasketProductsFlat) !==
      JSON.stringify(basketProductsFlat)
    ) {
      setBasketProductsFlat(newBasketProductsFlat);
    }
  }, [newBasketProductsFlat, basketProductsFlat, setBasketProductsFlat]);

  const sortProducts = (products: BasketProductFlat[]) => {
    const getSortValue = (product: BasketProductFlat) => {
      switch (selectedSortCriteria) {
        case "Kalorien":
          return product.nutrients.kcal;
        case "Proteine":
          return product.nutrients.proteins;
        case "Fette":
          return product.nutrients.fats;
        case "Kohlenhydrate":
          return product.nutrients.carbohydrates;
        case "Nahrungsfasern":
          return product.nutrients.fibers;
        default:
          return product.basketIndex;
      }
    };

    return [...products].sort((a, b) =>
      ascending
        ? getSortValue(a) - getSortValue(b)
        : getSortValue(b) - getSortValue(a)
    );
  };

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

  const sortedProducts = sortProducts(filteredProducts);

  const availableCategories = {
    major: Array.from(
      new Set(
        basketProductsFlat.map((product) => product.dietCoachCategoryL1.de)
      )
    ),
    sub: Array.from(
      new Set(
        basketProductsFlat.map((product) => product.dietCoachCategoryL2.de)
      )
    ),
  };

  useEffect(() => {
    if (!sortCriteria.includes(selectedSortCriteria)) {
      setSelectedSortCriteria(selectedSortCriteria);
    }
  }, [selectedSortCriteria, setSelectedSortCriteria]);

  const handleDrawerOpen = (open: boolean) => {
    setDrawerOpen(open);
    setOverlayVisible(open);
  };

  const categoriesWithSub = availableCategories.major.map((majorCategory) => ({
    major: majorCategory,
    subs: basketProductsFlat
      .filter((product) => product.dietCoachCategoryL1.de === majorCategory)
      .map((product) => product.dietCoachCategoryL2.de)
      .filter((sub, index, self) => self.indexOf(sub) === index),
  }));

  return (
    <div className="relative pt-6 -mr-8 bg-white border-x flex flex-col shrink-0 border-t border-b border-gray-200 lg:w-96 lg:border-t-0 lg:pr-8 xl:pr-6 max-h-[calc(100vh-187px)]">
      {overlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}
      <ProductsHeader products={sortedProducts} />

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

      <div className="-mr-6 flex-1 overflow-y-auto min-h-0 min-h-80 shadow-inner">
        {selectedCategories.major.length === 0 &&
          selectedCategories.sub.length === 0 && (
            <p className="px-6 mt-6 text-gray-500">
              Bitte wählen Sie mindestens eine Lebensmittelkategorie aus, um die
              Artikel anzuzeigen.
            </p>
          )}
        <ul role="list" className="divide-y divide-gray-100">
          {sortedProducts.map((product) => {
            return (
              <ProductCard
                key={`${product.basketId},${product.productId}`}
                product={product}
              />
            );
          })}
        </ul>
        <div className="flex justify-end p-6">
          <button
            type="button"
            onClick={() => handleDrawerOpen(true)}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-green-700"
          >
            Alternative Produkte empfehlen
          </button>
        </div>
      </div>
      <RecommendationDrawer open={drawerOpen} setOpen={handleDrawerOpen} />
    </div>
  );
};

export default Products;
