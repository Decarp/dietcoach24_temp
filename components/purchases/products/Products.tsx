import React, { useState, useEffect } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CakeIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { classNames } from "@/utils/classNames";
import ProductsHeader from "@/components/purchases/products/ProductsHeader";
import {
  BasketProductFlat,
  SelectedBasketIds,
  SelectedBasketProductId,
} from "@/app/p/[id]/purchases/page";
import { useCounterStore } from "@/providers/useStoreProvider";
import RecommendationDrawer from "./RecommendationDrawer";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const foodCategories = [
  { value: "Getränke", label: "Getränke" },
  { value: "Früchte", label: "Früchte" },
  { value: "Getreide", label: "Getreide" },
  {
    value: "Verarbeitete Lebensmittel",
    label: "Verarbeitete Lebensmittel",
  },
  {
    value: "Proteinreiche Lebensmittel",
    label: "Proteinreiche Lebensmittel",
  },
  { value: "Gemüse", label: "Gemüse" },
];

const sortCriteria = [
  "Einkaufsdatum",
  "Kalorien",
  "Proteine",
  "Fette",
  "Kohlenhydrate",
  "Nahrungsfasern",
];

const Products = ({
  filteredBasketProductsFlat,
  selectedBasketProductIds,
  handleProductCheckboxChange,
  selectedBasketIds,
}: {
  filteredBasketProductsFlat: BasketProductFlat[];
  selectedBasketProductIds: SelectedBasketProductId[];
  handleProductCheckboxChange: any;
  selectedBasketIds: SelectedBasketIds;
}) => {
  const [ascending, setAscending] = useState(true);
  const {
    selectedCategories,
    setSelectedCategories,
    selectedSortCriteria,
    setSelectedSortCriteria,
  } = useCounterStore((state) => state);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (
      selectedSortCriteria !== "Einkaufsdatum" &&
      selectedSortCriteria !== "Kalorien" &&
      selectedSortCriteria !== "Protein" &&
      selectedSortCriteria !== "Fett" &&
      selectedSortCriteria !== "Kohlenhydrate" &&
      selectedSortCriteria !== "Nahrungsfasern"
    ) {
      setSelectedSortCriteria(selectedSortCriteria);
    }
  }, [selectedSortCriteria, setSelectedSortCriteria]);

  const isProductSelected = (productId: number, basketId: number) =>
    selectedBasketProductIds.some(
      (item) => item.productId === productId && item.basketId === basketId
    );

  const sortProducts = (products: BasketProductFlat[]) => {
    const sortedProducts = [...products].sort((a, b) => {
      let aValue, bValue;

      switch (selectedSortCriteria) {
        case "Kalorien":
          aValue = a.kcal;
          bValue = b.kcal;
          break;
        case "Protein":
          aValue = a.protein;
          bValue = b.protein;
          break;
        case "Fett":
          aValue = a.fat;
          bValue = b.fat;
          break;
        case "Kohlenhydrate":
          aValue = a.carbs;
          bValue = b.carbs;
          break;
        case "Nahrungsfasern":
          aValue = a.fiber;
          bValue = b.fiber;
          break;
        default:
          aValue = a.basketIndex;
          bValue = b.basketIndex;
      }

      if (ascending) {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sortedProducts;
  };

  const handleCategoryChange = (category: string) => {
    selectedCategories.includes(category)
      ? setSelectedCategories(selectedCategories.filter((i) => i !== category))
      : setSelectedCategories([...selectedCategories, category]);
  };

  const filteredProducts =
    selectedCategories.length > 0
      ? filteredBasketProductsFlat.filter((product) =>
          selectedCategories.includes(product.category.de)
        )
      : [];

  const sortedProducts = sortProducts(filteredProducts);

  const handleDrawerOpen = (open: boolean) => {
    setDrawerOpen(open);
    setOverlayVisible(open);
  };

  return (
    <div className="relative pt-6 -mr-8 bg-white border-x flex flex-col shrink-0 border-t border-b border-gray-200 lg:w-96 lg:border-t-0 lg:pr-8 xl:pr-6 max-h-[calc(100vh-187px)]">
      {overlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}
      <ProductsHeader
        filteredProducts={filteredBasketProductsFlat}
        selectedBasketIds={selectedBasketIds}
      />

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
                {foodCategories.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      value={option.value}
                      type="checkbox"
                      checked={selectedCategories.includes(option.value)}
                      onChange={() => handleCategoryChange(option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                      {option.label}
                    </label>
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
        {selectedCategories.length === 0 && (
          <p className="px-6 mt-6 text-gray-500">
            Bitte wählen Sie mindestens eine Lebensmittelkategorie aus, um die
            Artikel anzuzeigen.
          </p>
        )}
        <ul role="list" className="divide-y divide-gray-100">
          {sortedProducts.map((product) => {
            const uniqueId = `${product.basketId},${product.productId}`;
            const selected = isProductSelected(
              product.productId,
              product.basketId
            );
            return (
              <li
                key={uniqueId}
                className={classNames(
                  "pl-6 flex items-center gap-x-4 px-3 py-5",
                  selected ? "bg-primary text-white" : ""
                )}
              >
                <CakeIcon
                  className={classNames(
                    "border border-gray-200 h-20 w-20 p-2 flex-none rounded-md",
                    selected
                      ? "bg-white text-primary"
                      : "bg-gray-50 text-primary"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={classNames(
                      "text-base font-semibold leading-6",
                      selected ? "text-white" : "text-gray-900"
                    )}
                  >
                    {product.name}
                  </p>
                  <p
                    className={classNames(
                      "truncate text-sm leading-5",
                      selected ? "text-white" : "text-gray-500"
                    )}
                  >
                    {product.nutriscore}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 mx-auto mr-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selected}
                  onChange={() =>
                    handleProductCheckboxChange({
                      basketId: product.basketId,
                      productId: product.productId,
                    })
                  }
                />
              </li>
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
