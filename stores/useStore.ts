import {
  BasketProductFlat,
  CategorySelection,
  SelectedBasketProductId,
  MacroCategory,
  MicroCategory,
  BasketProduct,
  DatabaseProduct,
} from "@/types/types";
import { createStore } from "zustand/vanilla";

export type CounterState = {
  selectedCategories: CategorySelection;
  availableCategories: CategorySelection;
  selectedSortCriteria: string;
  selectedBasketIds: string[];
  selectedComparisonBasketIds: string[];
  selectedBasketProductIds: SelectedBasketProductId[];
  selectedBasketProductsFlat: BasketProductFlat[];
  selectedAlternativeProducts: DatabaseProduct[];
  selectedSessionId: number | null;
  selectedSessionIndex: number | null;
  currentTab: string;
  patientId: string | null;
  basketProducts: BasketProduct[];
  basketProductsFlat: BasketProductFlat[];
  selectedMacro: MacroCategory;
  selectedMicro: MicroCategory;
  highlightBorder: boolean;
  hideBaskets: boolean;
  hideProducts: boolean;
};

export type CounterActions = {
  setSelectedCategories: (cats: CategorySelection) => void;
  setAvailableCategories: (cats: CategorySelection) => void;
  setSelectedSortCriteria: (criteria: string) => void;
  setSelectedBasketIds: (ids: string[]) => void;
  setSelectedComparisonBasketIds: (ids: string[]) => void;
  setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) => void;
  setSelectedBasketProductsFlat: (products: BasketProductFlat[]) => void;
  setSelectedAlternativeProducts: (products: DatabaseProduct[]) => void;
  setSelectedSessionId: (id: number | null) => void;
  setSelectedSessionIndex: (index: number | null) => void;
  setCurrentTab: (tab: string) => void;
  setPatientId: (id: string | null) => void;
  setBasketProducts: (products: BasketProduct[]) => void;
  setBasketProductsFlat: (products: BasketProductFlat[]) => void;
  updateCategories: (
    category: string,
    level: "major" | "sub",
    replace?: boolean
  ) => void;
  setSelectedMacro: (macro: MacroCategory) => void;
  setSelectedMicro: (micro: MicroCategory) => void;
  setHighlightBorder: (highlight: boolean) => void;
  setHideBaskets: (hide: boolean) => void;
  setHideProducts: (hide: boolean) => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return {
    selectedCategories: { major: [], sub: [] },
    availableCategories: { major: [], sub: [] },
    selectedSortCriteria: "Kohlenhydrate",
    selectedBasketIds: [],
    selectedComparisonBasketIds: [],
    selectedBasketProductIds: [],
    selectedBasketProductsFlat: [],
    selectedAlternativeProducts: [],
    selectedSessionId: null,
    selectedSessionIndex: null,
    currentTab: "energy",
    patientId: null,
    basketProducts: [],
    basketProductsFlat: [],
    selectedMacro: "Kohlenhydrate",
    selectedMicro: "Salz",
    highlightBorder: false,
    hideBaskets: false,
    hideProducts: false,
  };
};

export const defaultInitState: CounterState = {
  selectedCategories: { major: [], sub: [] },
  availableCategories: { major: [], sub: [] },
  selectedSortCriteria: "Kohlenhydrate",
  selectedBasketIds: [],
  selectedComparisonBasketIds: [],
  selectedBasketProductIds: [],
  selectedBasketProductsFlat: [],
  selectedAlternativeProducts: [],
  selectedSessionId: null,
  selectedSessionIndex: null,
  currentTab: "energy",
  patientId: null,
  basketProducts: [],
  basketProductsFlat: [],
  selectedMacro: "Kohlenhydrate",
  selectedMicro: "Salz",
  highlightBorder: false,
  hideBaskets: false,
  hideProducts: false,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    setSelectedCategories: (cats: CategorySelection) =>
      set((state) => {
        const newSelectedBasketProductIds =
          state.selectedBasketProductIds.filter((id) =>
            state.basketProductsFlat.some(
              (product) =>
                product.basketId === id.basketId &&
                product.gtin === id.gtin &&
                (cats.major.includes(product.dietCoachCategoryL1.de) ||
                  cats.sub.includes(product.dietCoachCategoryL2.de))
            )
          );

        const newSelectedBasketProductsFlat = state.basketProductsFlat.filter(
          (product) =>
            newSelectedBasketProductIds.some(
              (id) =>
                product.basketId === id.basketId && product.gtin === id.gtin
            )
        );

        return {
          selectedCategories: cats,
          selectedBasketProductIds: newSelectedBasketProductIds,
          selectedBasketProductsFlat: newSelectedBasketProductsFlat,
        };
      }),
    setAvailableCategories: (cats: CategorySelection) =>
      set(() => ({
        availableCategories: cats,
      })),
    setSelectedSortCriteria: (criteria: string) =>
      set(() => ({ selectedSortCriteria: criteria })),
    setSelectedBasketIds: (ids: string[]) =>
      set(() => ({ selectedBasketIds: ids })),
    setSelectedComparisonBasketIds: (ids: string[]) =>
      set(() => ({ selectedComparisonBasketIds: ids })),
    setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) =>
      set((state) => {
        const newSelectedBasketProductsFlat = state.basketProductsFlat.filter(
          (product) =>
            ids.some(
              (id) =>
                product.basketId === id.basketId && product.gtin === id.gtin
            )
        );

        return {
          selectedBasketProductIds: ids,
          selectedBasketProductsFlat: newSelectedBasketProductsFlat,
        };
      }),
    setCurrentTab: (tab: string) => set(() => ({ currentTab: tab })),
    setPatientId: (id: string | null) => set(() => ({ patientId: id })),
    setBasketProducts: (products: BasketProduct[]) =>
      set(() => ({ basketProducts: products })),
    setBasketProductsFlat: (products: BasketProductFlat[]) =>
      set(() => ({ basketProductsFlat: products })),
    setSelectedBasketProductsFlat: (products: BasketProductFlat[]) =>
      set(() => ({ selectedBasketProductsFlat: products })),
    setSelectedAlternativeProducts: (products: DatabaseProduct[]) =>
      set(() => ({ selectedAlternativeProducts: products })),
    setSelectedSessionId: (id: number | null) =>
      set(() => ({ selectedSessionId: id })),
    setSelectedSessionIndex: (index: number | null) =>
      set(() => ({ selectedSessionIndex: index })),
    updateCategories: (
      category: string,
      level: "major" | "sub",
      replace: boolean = false
    ) =>
      set((state) => {
        let newCategories = { ...state.selectedCategories };

        if (replace) {
          // If replace is true, replace the selected categories with the new category
          if (level === "major") {
            newCategories = { major: [category], sub: [] };
          } else {
            // For sub-category, replace sub and make sure the corresponding major category is selected
            const majorCategory = state.basketProductsFlat.find(
              (product) => product.dietCoachCategoryL2.de === category
            )?.dietCoachCategoryL1.de;

            newCategories = {
              major: majorCategory ? [majorCategory] : [],
              sub: [category],
            };
          }
        } else {
          // Existing behavior when replace is false
          if (level === "major") {
            if (newCategories.major.includes(category)) {
              // Deselect major category and all its sub-categories
              newCategories.major = newCategories.major.filter(
                (i) => i !== category
              );
              newCategories.sub = newCategories.sub.filter(
                (sub) =>
                  !state.basketProductsFlat.some(
                    (product) =>
                      product.dietCoachCategoryL1.de === category &&
                      product.dietCoachCategoryL2.de === sub
                  )
              );
            } else {
              // Select major category and all its sub-categories
              newCategories.major.push(category);
              const newSubCategories = state.basketProductsFlat
                .filter(
                  (product) => product.dietCoachCategoryL1.de === category
                )
                .map((product) => product.dietCoachCategoryL2.de);

              // Use Set to ensure sub-categories are unique
              newCategories.sub = Array.from(
                new Set([...newCategories.sub, ...newSubCategories])
              );
            }
          } else {
            if (newCategories.sub.includes(category)) {
              // Deselect sub-category
              newCategories.sub = newCategories.sub.filter(
                (i) => i !== category
              );

              // Check if all sub-categories of this major category are deselected
              const majorCategory = state.basketProductsFlat.find(
                (product) => product.dietCoachCategoryL2.de === category
              )?.dietCoachCategoryL1.de;

              if (
                majorCategory &&
                !state.basketProductsFlat.some(
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
            } else {
              // Select sub-category
              newCategories.sub.push(category);

              // Automatically select the major category
              const majorCategory = state.basketProductsFlat.find(
                (product) => product.dietCoachCategoryL2.de === category
              )?.dietCoachCategoryL1.de;

              if (
                majorCategory &&
                !newCategories.major.includes(majorCategory)
              ) {
                newCategories.major.push(majorCategory);
              }
            }

            // Ensure sub-categories are unique
            newCategories.sub = Array.from(new Set(newCategories.sub));
          }
        }

        // Filter the selected basket products based on the updated categories
        const newSelectedBasketProductIds =
          state.selectedBasketProductIds.filter((id) =>
            state.basketProductsFlat.some(
              (product) =>
                product.basketId === id.basketId &&
                product.gtin === id.gtin &&
                (newCategories.major.includes(product.dietCoachCategoryL1.de) ||
                  newCategories.sub.includes(product.dietCoachCategoryL2.de))
            )
          );

        const newSelectedBasketProductsFlat = state.basketProductsFlat.filter(
          (product) =>
            newSelectedBasketProductIds.some(
              (id) =>
                product.basketId === id.basketId && product.gtin === id.gtin
            )
        );

        return {
          selectedCategories: newCategories,
          selectedBasketProductIds: newSelectedBasketProductIds,
          selectedBasketProductsFlat: newSelectedBasketProductsFlat,
        };
      }),
    setSelectedMacro: (macro: MacroCategory) =>
      set(() => ({ selectedMacro: macro })),
    setSelectedMicro: (micro: MicroCategory) =>
      set(() => ({ selectedMicro: micro })),
    setHighlightBorder: (highlight: boolean) => {
      set(() => ({ highlightBorder: highlight }));

      if (highlight) {
        setTimeout(() => {
          set(() => ({ highlightBorder: false }));
        }, 5000); // Reset after 5 seconds
      }
    },
    setHideBaskets: (hide: boolean) => set(() => ({ hideBaskets: hide })),
    setHideProducts: (hide: boolean) => set(() => ({ hideProducts: hide })),
  }));
};
