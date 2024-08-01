import { getBasketProducts } from "@/api/getBasketProducts";
import ProductsHeader from "@/components/purchases/products/ProductsHeader";
import { useCounterStore } from "@/providers/useStoreProvider";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import RecommendationDrawer from "./RecommendationDrawer";
import { BasketProductFlat } from "@/types/types";

const sortCriteria = [
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

  // Set basketProductsFlat in the store if it has changed; necessary for category filtering in useStore
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
        <div>
          <Popover className="relative inline-block text-left">
            <div>
              <PopoverButton className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                <span>Filter</span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </PopoverButton>
            </div>

            <PopoverPanel
              transition
              className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <form className="space-y-4">
                {categoriesWithSub.map((category) => (
                  <div key={category.major}>
                    <div className="flex items-center">
                      <input
                        value={category.major}
                        type="checkbox"
                        checked={selectedCategories.major.includes(
                          category.major
                        )}
                        onChange={() =>
                          updateCategories(category.major, "major")
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                        {category.major}
                      </label>
                    </div>
                    <div className="ml-7">
                      {category.subs.map((subCategory) => (
                        <div key={subCategory} className="flex items-center">
                          <input
                            value={subCategory}
                            type="checkbox"
                            checked={selectedCategories.sub.includes(
                              subCategory
                            )}
                            onChange={() =>
                              updateCategories(subCategory, "sub")
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label className="ml-3 whitespace-nowrap pr-6 text-sm text-gray-900">
                            {subCategory}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>
            </PopoverPanel>
          </Popover>
        </div>

        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sortieren nach
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </MenuButton>
            </div>

            <MenuItems className="absolute left-0 z-10 mt-2 w-50 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
              <div className="py-1">
                {sortCriteria.map((option) => (
                  <MenuItem key={option}>
                    {({ active }) => (
                      <div className=" ml-4 flex items-center">
                        <input
                          type="radio"
                          name="sortCriteria"
                          value={option}
                          checked={selectedSortCriteria === option}
                          onChange={() => setSelectedSortCriteria(option)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <label
                          className="block px-4 py-2 text-sm font-medium text-gray-900 data-[focus]:bg-gray-100"
                          onClick={() => setSelectedSortCriteria(option)}
                        >
                          {option}
                        </label>
                      </div>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>

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
