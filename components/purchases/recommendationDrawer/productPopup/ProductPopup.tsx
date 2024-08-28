"use client";

import { Spinner } from "@/components/Spinner";
import { categories } from "@/data/categories";
import { useCounterStore } from "@/providers/useStoreProvider";
import {
  CategorySelection,
  DatabaseProduct,
  DatabaseProducts,
} from "@/types/types";
import { fetchProducts } from "@/utils/fetchProducts";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import NutriScoreMenu from "../../products/NutriScoreMenu";
import SortMenu from "../../products/SortMenu";
import FilterPopoverProduct from "./FilterPopoverProduct";

type CategoryKeys = keyof typeof categories.de;

const sortProducts = (
  products: DatabaseProduct[],
  selectedSortCriteria: string,
  ascending: boolean
) => {
  const getSortValue = (product: DatabaseProduct) => {
    switch (selectedSortCriteria) {
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
        return product.nutrients.fibers;
      case "Salz":
        return product.nutrients.salt;
      default:
        return 0;
    }
  };

  return [...products].sort((a, b) =>
    ascending
      ? getSortValue(a) - getSortValue(b)
      : getSortValue(b) - getSortValue(a)
  );
};

export default function ProductPopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [ascending, setAscending] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<DatabaseProduct[]>(
    []
  );
  const [sortedProducts, setSortedProducts] = useState<DatabaseProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [nutriScoreCutOff, setNutriScoreCutOff] = useState("E");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProductCategories, setSelectedProductCategories] =
    useState<CategorySelection>({
      major: [],
      sub: [],
    });
  const categoriesWithSub: { major: string; subs: string[] }[] = Object.entries(
    categories.de
  ).map(([major, subs]) => ({
    major,
    subs,
  }));

  const {
    selectedSortCriteria,
    selectedAlternativeProducts,
    setSelectedSortCriteria,
    setSelectedAlternativeProducts,
  } = useCounterStore((state) => state);

  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const queryParams = new URLSearchParams({
    retailer: "Migros",
    page: currentPage.toString(),
    limit: "100",
    "nutri-score-cutoff": nutriScoreCutOff,
  });

  if (selectedProductCategories.major.length > 0) {
    selectedProductCategories.major.forEach((major) =>
      queryParams.append("dietcoach-category-l1-de", major)
    );
  }

  if (selectedProductCategories.sub.length > 0) {
    selectedProductCategories.sub.forEach((sub) =>
      queryParams.append("dietcoach-category-l2-de", sub)
    );
  }

  if (searchTerm.length > 0) {
    queryParams.append("search-de", searchTerm);
  }

  // Use useQuery hook to fetch data
  const { data, isLoading, error } = useQuery<DatabaseProducts>({
    queryKey: ["products", queryParams.toString()], // Unique query key
    queryFn: () => fetchProducts(queryParams), // Fetch function
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setAvailableProducts(data.products);
      setSortedProducts(
        sortProducts(data.products, selectedSortCriteria, ascending)
      );
      setTotalPages(data.meta.totalPages);
    }
  }, [data, ascending, selectedSortCriteria]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddProduct = (product: DatabaseProduct) => {
    setSelectedAlternativeProducts([...selectedAlternativeProducts, product]);
  };

  const handleRemoveProduct = (gtin: number) => {
    setSelectedAlternativeProducts(
      selectedAlternativeProducts.filter(
        (product) => product.productId !== gtin
      )
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };

  const updateCategories = (category: string, type: "major" | "sub") => {
    setSelectedProductCategories((prevState) => {
      let newMajor = [...prevState.major];
      let newSub = [...prevState.sub];

      if (type === "major") {
        if (newMajor.includes(category)) {
          newMajor = newMajor.filter((cat) => cat !== category);
          const relatedSubs = categories.de[category as CategoryKeys];
          newSub = newSub.filter((sub) => !relatedSubs.includes(sub));
        } else {
          newMajor.push(category);
          newSub = [...newSub, ...categories.de[category as CategoryKeys]];
        }
      } else if (type === "sub") {
        if (newSub.includes(category)) {
          newSub = newSub.filter((sub) => sub !== category);
          const parentMajor = Object.keys(categories.de).find((major) =>
            categories.de[major as CategoryKeys].includes(category)
          );
          if (
            parentMajor &&
            !newSub.some((sub) =>
              categories.de[parentMajor as CategoryKeys].includes(sub)
            )
          ) {
            newMajor = newMajor.filter((major) => major !== parentMajor);
          }
        } else {
          newSub.push(category);
          const parentMajor = Object.keys(categories.de).find((major) =>
            categories.de[major as CategoryKeys].includes(category)
          );
          if (parentMajor && !newMajor.includes(parentMajor)) {
            newMajor.push(parentMajor);
          }
        }
      }

      return {
        major: newMajor,
        sub: newSub,
      };
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Alternative Produkte auswählen
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Wählen Sie aus dem gesamten Sortiment alternative Produkte
                    aus, die Sie ihrem Kunden empfehlen möchten.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="px-6 flex justify-between items-center">
                <div className="space-x-8">
                  <FilterPopoverProduct
                    categoriesWithSub={categoriesWithSub}
                    selectedCategories={selectedProductCategories}
                    updateCategories={updateCategories}
                  />

                  <SortMenu
                    selectedSortCriteria={selectedSortCriteria}
                    setSelectedSortCriteria={setSelectedSortCriteria}
                  />

                  <NutriScoreMenu
                    selectedNutriScore={nutriScoreCutOff}
                    setSelectedNutriScore={setNutriScoreCutOff}
                  />
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
              <div>
                <input
                  type="text"
                  placeholder="Suchbegiff eingeben"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div
                ref={scrollableContainerRef}
                className="bg-white border border-gray-300 rounded-md h-[420px] overflow-y-scroll"
              >
                {isLoading ? (
                  <Spinner />
                ) : selectedProductCategories.major.length === 0 &&
                  selectedProductCategories.sub.length === 0 &&
                  searchTerm.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        Keine Produkte ausgewählt
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Bitte wählen Sie eine Kategorie oder geben Sie einen
                        Suchbegriff ein.
                      </p>
                    </div>
                  </div>
                ) : (
                  sortedProducts?.map((product) => (
                    <div
                      key={product.productId}
                      className={
                        selectedAlternativeProducts.some(
                          (altProduct) =>
                            altProduct.productId === product.productId
                        )
                          ? "flex items-center space-x-4 justify-between bg-primary p-4"
                          : "flex items-center space-x-4 justify-between p-4"
                      }
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0" />
                        <div>
                          <h4
                            className={
                              selectedAlternativeProducts.some(
                                (altProduct) =>
                                  altProduct.productId === product.productId
                              )
                                ? "text-white font-semibold"
                                : "text-gray-900 font-semibold"
                            }
                          >
                            {product.de.name}
                          </h4>
                          <p
                            className={
                              selectedAlternativeProducts.some(
                                (altProduct) =>
                                  altProduct.productId === product.productId
                              )
                                ? "text-gray-300"
                                : "text-gray-500"
                            }
                          >
                            {product.nutriScoreV2023Detail.nutriScoreCalculated}
                          </p>
                          <p
                            className={
                              selectedAlternativeProducts.some(
                                (altProduct) =>
                                  altProduct.productId === product.productId
                              )
                                ? "text-gray-300"
                                : "text-gray-500"
                            }
                          >
                            {product.dietCoachCategoryL1.de}
                          </p>
                        </div>
                      </div>
                      {selectedAlternativeProducts.some(
                        (altProduct) =>
                          altProduct.productId === product.productId
                      ) ? (
                        <CheckCircleIcon
                          className="h-6 w-6 text-white hover:text-gray-200 cursor-pointer flex-shrink-0"
                          onClick={() => handleRemoveProduct(product.productId)}
                        />
                      ) : (
                        <PlusCircleIcon
                          className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer flex-shrink-0"
                          onClick={() => handleAddProduct(product)}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ChevronLeftIcon
                  className="mr-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Zurück
              </button>
              <span className="text-sm text-gray-700 font-medium">
                Seite {currentPage} von {totalPages} mit{" "}
                {availableProducts?.length} Produkten
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Vor
                <ChevronRightIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Speichern
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
