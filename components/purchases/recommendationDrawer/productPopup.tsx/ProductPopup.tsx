"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Product, Products } from "@/types/types";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { useCounterStore } from "@/providers/useStoreProvider";
import SortMenu from "../../products/SortMenu";
import FilterPopover from "../../products/FilterPopover";
import { sortCriteria } from "../../products/Products";

export default function ProductPopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [ascending, setAscending] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [headers, setHeaders] = useState({
    retailer: "Migros",
    Page: "1",
    Limit: "110",
    // "Search-De": "",
    "DietCoach-Category-L2-De": "",
    "DietCoach-Category-L1-De": "",
    "Nutri-Score-Cutoff": "E",
  });

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

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      const query = new URLSearchParams(headers).toString();
      try {
        const response = await fetch(`/api?${query}`);
        const data: Products = await response.json();
        setAvailableProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch available products:", error);
      }
    };

    fetchAvailableProducts();
  }, [headers]);

  const updateHeaders = () => {
    setHeaders((prevHeaders) => ({
      ...prevHeaders,
      "DietCoach-Category-L1-De": selectedCategories.major.join(","),
      "DietCoach-Category-L2-De": selectedCategories.sub.join(","),
    }));
  };

  useEffect(() => {
    updateHeaders();
  }, [selectedCategories]);

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
            <div className="space-y-4 p-4">
              <div className="px-6 -mt-2 pb-2 flex justify-between items-center">
                <div className="space-x-8">
                  <FilterPopover
                    categoriesWithSub={categoriesWithSub}
                    selectedCategories={selectedCategories}
                    updateCategories={updateCategories}
                    layout="right"
                  />

                  <SortMenu
                    sortCriteria={sortCriteria}
                    selectedSortCriteria={selectedSortCriteria}
                    setSelectedSortCriteria={setSelectedSortCriteria}
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
              <div className="bg-white p-4 border rounded-md h-[420px] overflow-y-scroll space-y-4">
                {availableProducts?.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center space-x-4 justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-md bg-gray-200"></div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">
                          {product.de.name}
                        </h4>
                        <p className="text-gray-500">
                          {product.dietCoachCategoryL1.de}
                        </p>
                      </div>
                    </div>
                    <PlusCircleIcon className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
                    <CheckCircleIcon className="h-6 w-6 text-primary hover:text-gray-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Fertig
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
