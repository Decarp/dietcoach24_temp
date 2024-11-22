import ProductCard from "@/components/ProductCard";
import ProductsHeader from "@/components/purchases/products/ProductsHeader";
import { Spinner } from "@/components/Spinner";
import { sortCriteria } from "@/constants/sortCriteria";
import { useCounterStore } from "@/providers/useStoreProvider";
import { BasketProduct, BasketProductFlat } from "@/types/types";
import { fetchBasketProducts } from "@/utils/fetchBasketProducts";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RecommendationDrawer from "../recommendationDrawer/RecommendationDrawer";
import FilterPopover from "./FilterPopover";
import SortMenu from "./SortMenu";
import { categories } from "@/constants/categories";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import CompletedPopup from "../recommendationDrawer/CompletedPopup";

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
  const [completedPopupOpen, setCompletedPopupOpen] = useState(false);

  const {
    hideProducts,
    selectedBasketIds,
    selectedCategories,
    selectedSortCriteria,
    selectedBasketProductIds,
    setSelectedBasketProductIds,
    selectedBasketProductsFlat,
    setSelectedBasketProductsFlat,
    basketProducts,
    basketProductsFlat,
    setBasketProductsFlat,
    highlightBorder,
    setSelectedSortCriteria,
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
    if (!open && completedPopupOpen) {
      setCompletedPopupOpen(false);
    }
  };

  const categoriesWithSub: { major: string; subs: string[] }[] = Object.entries(
    categories.de
  ).map(([major, subs]) => ({
    major,
    subs,
  }));

  // Determine if all products are selected
  const areAllProductsSelected = sortedProducts.every((product) =>
    selectedBasketProductIds.some((item) => item.gtin === product.gtin)
  );

  // Handle checkbox change event
  const handleSelectAllChange = () => {
    if (areAllProductsSelected) {
      // Unselect all products
      const newSelectedBasketProductIds = selectedBasketProductIds.filter(
        (item) => !sortedProducts.some((product) => product.gtin === item.gtin)
      );
      const newSelectedBasketProductsFlat = selectedBasketProductsFlat.filter(
        (product) => !sortedProducts.some((p) => p.gtin === product.gtin)
      );
      setSelectedBasketProductIds(newSelectedBasketProductIds);
      setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);
    } else {
      // Select all products
      const newSelectedBasketProductIds = [...selectedBasketProductIds];
      const newSelectedBasketProductsFlat = [...selectedBasketProductsFlat];

      sortedProducts.forEach((product) => {
        if (
          !selectedBasketProductIds.some((item) => item.gtin === product.gtin)
        ) {
          newSelectedBasketProductIds.push({
            basketId: product.basketId,
            gtin: product.gtin,
          });
          newSelectedBasketProductsFlat.push(product);
        }
      });

      setSelectedBasketProductIds(newSelectedBasketProductIds);
      setSelectedBasketProductsFlat(newSelectedBasketProductsFlat);
    }
  };

  return (
    <div
      className={`relative pt-6 -mr-8 bg-white border-r flex flex-col shrink-0 border-t border-b border-gray-300 min-w-60 md:max-w-96 xl:w-96 lg:border-t-0 lg:pr-8 xl:pr-6 h-[calc(100vh-185px)] transform transition-all duration-1000 ease-in-out ${
        hideProducts
          ? "opacity-0 translate-x-10 -mr-96"
          : "opacity-100 translate-x-0"
      }`}
    >
      <ProductsHeader products={sortedProducts} />

      <div className="border-b border-gray-300 px-6 mt-[1px] -mr-6 pb-2 flex gap-x-8 items-center">
        <FilterPopover
          categoriesWithSub={categoriesWithSub}
          selectedCategories={selectedCategories}
        />

        <SortMenu
          selectedSortCriteria={selectedSortCriteria}
          setSelectedSortCriteria={setSelectedSortCriteria}
        />

        <button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          onClick={() => setAscending(!ascending)}
        >
          {ascending ? (
            <ArrowUpIcon className="h-5 w-5 text-gray-400 hover:scale-125 transform-transition" />
          ) : (
            <ArrowDownIcon className="h-5 w-5 text-gray-400 hover:scale-125 transform-transition" />
          )}
        </button>

        <input
          type="checkbox"
          className="h-4 w-4 mx-auto mr-1 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          checked={areAllProductsSelected}
          onChange={handleSelectAllChange}
        />
      </div>

      <div className="-mr-6 flex-1 overflow-y-auto min-h-0 shadow-inner border-b border-gray-300">
        {isLoading && <Spinner className="mt-4" />}
        {selectedCategories.major.length === 0 &&
          !isLoading &&
          selectedCategories.sub.length === 0 && (
            <div className="flex mt-12 px-4">
              <ArrowUpIcon className="ml-3 h-12 w-12 text-gray-400 mr-6 flex-shrink-0" />
              <div className="text-center">
                <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-6 text-sm font-semibold text-gray-900">
                  Keine Lebensmittelkategorie ausgewählt
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Wählen Sie mindestens eine Lebensmittelkategorie aus, um die
                  Lebensmittel anzuzeigen.
                </p>
              </div>
            </div>
          )}
        <ul
          role="list"
          className={`divide-y divide-gray-300 ${
            highlightBorder && "bg-orange-100 border-8 animate-pulse-border"
          }`}
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.gtin} product={product} />
          ))}
        </ul>
      </div>

      {(selectedCategories.major.length !== 0 ||
        selectedCategories.sub.length !== 0) && (
        <div className="flex justify-end py-6">
          <Button
            onClick={() => handleDrawerOpen(true)}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            {selectedBasketProductIds.length === 0
              ? "Empfehlung erstellen"
              : `Empfehlung erstellen (${selectedBasketProductIds.length})`}
          </Button>
        </div>
      )}

      <RecommendationDrawer
        open={drawerOpen}
        setOpen={handleDrawerOpen}
        onSuccess={() => setCompletedPopupOpen(true)}
      />

      <CompletedPopup
        open={completedPopupOpen}
        setOpen={setCompletedPopupOpen}
      />
    </div>
  );
};

export default Products;
