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
import { BasketProductFlat, SelectedBasketProductId } from "@/types/types";

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
    setSelectedCategories,
    selectedSortCriteria,
    setSelectedSortCriteria,
    basketProductsFlat,
    setBasketProductsFlat,
    selectedBasketProductIds,
    setSelectedBasketProductIds,
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

  // Set basketProductsFlat in the store if it has changed
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

  const handleCategoryChange = (category: string, level: "major" | "sub") => {
    const newCategories = { ...selectedCategories };

    if (level === "major") {
      if (newCategories.major.includes(category)) {
        // Deselect major category and all its sub-categories
        newCategories.major = newCategories.major.filter((i) => i !== category);
        newCategories.sub = newCategories.sub.filter(
          (sub) =>
            !basketProductsFlat.some(
              (product) =>
                product.dietCoachCategoryL1.de === category &&
                product.dietCoachCategoryL2.de === sub
            )
        );

        // Remove deselected products from selectedBasketProductIds
        const newSelectedBasketProductIds = selectedBasketProductIds.filter(
          (id) =>
            !basketProductsFlat.some(
              (product) =>
                product.basketId === id.basketId &&
                product.productId === id.productId &&
                product.dietCoachCategoryL1.de === category
            )
        );
        setSelectedBasketProductIds(newSelectedBasketProductIds);
      } else {
        // Select major category and all its sub-categories
        newCategories.major.push(category);
        newCategories.sub.push(
          ...basketProductsFlat
            .filter((product) => product.dietCoachCategoryL1.de === category)
            .map((product) => product.dietCoachCategoryL2.de)
        );
      }
    } else {
      if (newCategories.sub.includes(category)) {
        // Deselect sub-category
        newCategories.sub = newCategories.sub.filter((i) => i !== category);

        // Check if all sub-categories of this major category are deselected
        const majorCategory = basketProductsFlat.find(
          (product) => product.dietCoachCategoryL2.de === category
        )?.dietCoachCategoryL1.de;

        if (
          majorCategory &&
          !basketProductsFlat.some(
            (product) =>
              product.dietCoachCategoryL1.de === majorCategory &&
              newCategories.sub.includes(product.dietCoachCategoryL2.de)
          )
        ) {
          // Deselect the major category
          newCategories.major = newCategories.major.filter(
            (i) => i !== majorCategory
          );
        }

        // Remove deselected products from selectedBasketProductIds
        const newSelectedBasketProductIds = selectedBasketProductIds.filter(
          (id) =>
            !basketProductsFlat.some(
              (product) =>
                product.basketId === id.basketId &&
                product.productId === id.productId &&
                product.dietCoachCategoryL2.de === category
            )
        );
        setSelectedBasketProductIds(newSelectedBasketProductIds);
      } else {
        // Select sub-category
        newCategories.sub.push(category);

        // Automatically select the major category
        const majorCategory = basketProductsFlat.find(
          (product) => product.dietCoachCategoryL2.de === category
        )?.dietCoachCategoryL1.de;

        if (majorCategory && !newCategories.major.includes(majorCategory)) {
          newCategories.major.push(majorCategory);
        }
      }
    }

    setSelectedCategories(newCategories);
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
                <div>
                  <h4 className="font-semibold">Major Categories</h4>
                  {availableCategories.major.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        value={category}
                        type="checkbox"
                        checked={selectedCategories.major.includes(category)}
                        onChange={() => handleCategoryChange(category, "major")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold">Sub Categories</h4>
                  {availableCategories.sub.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        value={category}
                        type="checkbox"
                        checked={selectedCategories.sub.includes(category)}
                        onChange={() => handleCategoryChange(category, "sub")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
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
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
