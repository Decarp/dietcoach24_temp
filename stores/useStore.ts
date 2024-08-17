import {
  BasketProductFlat,
  CategorySelection,
  Product,
  SelectedBasketProductId,
  MacroCategory,
  MicroCategory,
} from "@/types/types";
import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  selectedCategories: CategorySelection;
  selectedSortCriteria: string;
  selectedBasketIds: string[];
  selectedComparisonBasketIds: string[];
  selectedBasketProductIds: SelectedBasketProductId[];
  selectedBasketProductsFlat: BasketProductFlat[];
  selectedAlternativeProducts: Product[];
  selectedSessionId: number | null;
  currentTab: string;
  patientId: string | null;
  basketProductsFlat: BasketProductFlat[];
  selectedMacro: MacroCategory;
  selectedMicro: MicroCategory;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  setSelectedCategories: (cats: CategorySelection) => void;
  setSelectedSortCriteria: (criteria: string) => void;
  setSelectedBasketIds: (ids: string[]) => void;
  setSelectedComparisonBasketIds: (ids: string[]) => void;
  setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) => void;
  setSelectedBasketProductsFlat: (products: BasketProductFlat[]) => void;
  setSelectedAlternativeProducts: (products: Product[]) => void;
  setSelectedSessionId: (id: number | null) => void;
  setCurrentTab: (tab: string) => void;
  setPatientId: (id: string | null) => void;
  setBasketProductsFlat: (products: BasketProductFlat[]) => void;
  updateCategories: (category: string, level: "major" | "sub") => void;
  setSelectedMacro: (macro: MacroCategory) => void;
  setSelectedMicro: (micro: MicroCategory) => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return {
    count: new Date().getFullYear(),
    selectedCategories: { major: [], sub: [] },
    selectedSortCriteria: "Einkaufsdatum",
    selectedBasketIds: [],
    selectedComparisonBasketIds: [],
    selectedBasketProductIds: [],
    selectedBasketProductsFlat: [],
    selectedAlternativeProducts: [],
    selectedSessionId: null,
    currentTab: "energy",
    patientId: null,
    basketProductsFlat: [],
    selectedMacro: "Kohlenhydrate",
    selectedMicro: "Salz",
  };
};

export const defaultInitState: CounterState = {
  count: 0,
  selectedCategories: { major: [], sub: [] },
  selectedSortCriteria: "Einkaufsdatum",
  selectedBasketIds: [],
  selectedComparisonBasketIds: [],
  selectedBasketProductIds: [],
  selectedBasketProductsFlat: [],
  selectedAlternativeProducts: [],
  selectedSessionId: null,
  currentTab: "energy",
  patientId: null,
  basketProductsFlat: [],
  selectedMacro: "Kohlenhydrate",
  selectedMicro: "Salz",
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setSelectedCategories: (cats: CategorySelection) =>
      set((state) => {
        const newSelectedBasketProductIds =
          state.selectedBasketProductIds.filter((id) =>
            state.basketProductsFlat.some(
              (product) =>
                product.basketId === id.basketId &&
                product.productId === id.productId &&
                (cats.major.includes(product.dietCoachCategoryL1.de) ||
                  cats.sub.includes(product.dietCoachCategoryL2.de))
            )
          );

        const newSelectedBasketProductsFlat = state.basketProductsFlat.filter(
          (product) =>
            newSelectedBasketProductIds.some(
              (id) =>
                product.basketId === id.basketId &&
                product.productId === id.productId
            )
        );

        return {
          selectedCategories: cats,
          selectedBasketProductIds: newSelectedBasketProductIds,
          selectedBasketProductsFlat: newSelectedBasketProductsFlat,
        };
      }),
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
                product.basketId === id.basketId &&
                product.productId === id.productId
            )
        );

        return {
          selectedBasketProductIds: ids,
          selectedBasketProductsFlat: newSelectedBasketProductsFlat,
        };
      }),
    setCurrentTab: (tab: string) => set(() => ({ currentTab: tab })),
    setPatientId: (id: string | null) => set(() => ({ patientId: id })),
    setBasketProductsFlat: (products: BasketProductFlat[]) =>
      set(() => ({ basketProductsFlat: products })),
    setSelectedBasketProductsFlat: (products: BasketProductFlat[]) =>
      set(() => ({ selectedBasketProductsFlat: products })),
    setSelectedAlternativeProducts: (products: Product[]) =>
      set(() => ({ selectedAlternativeProducts: products })),
    setSelectedSessionId: (id: number | null) =>
      set(() => ({ selectedSessionId: id })),
    updateCategories: (category: string, level: "major" | "sub") =>
      set((state) => {
        const newCategories = { ...state.selectedCategories };

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

            // Remove deselected products from selectedBasketProductIds
            const newSelectedBasketProductIds =
              state.selectedBasketProductIds.filter(
                (id) =>
                  !state.basketProductsFlat.some(
                    (product) =>
                      product.basketId === id.basketId &&
                      product.productId === id.productId &&
                      product.dietCoachCategoryL1.de === category
                  )
              );

            const newSelectedBasketProductsFlat =
              state.basketProductsFlat.filter((product) =>
                newSelectedBasketProductIds.some(
                  (id) =>
                    product.basketId === id.basketId &&
                    product.productId === id.productId
                )
              );

            return {
              selectedCategories: newCategories,
              selectedBasketProductIds: newSelectedBasketProductIds,
              selectedBasketProductsFlat: newSelectedBasketProductsFlat,
            };
          } else {
            // Select major category and all its sub-categories
            newCategories.major.push(category);
            newCategories.sub.push(
              ...state.basketProductsFlat
                .filter(
                  (product) => product.dietCoachCategoryL1.de === category
                )
                .map((product) => product.dietCoachCategoryL2.de)
            );

            const newSelectedBasketProductIds =
              state.selectedBasketProductIds.filter((id) =>
                state.basketProductsFlat.some(
                  (product) =>
                    product.basketId === id.basketId &&
                    product.productId === id.productId &&
                    (newCategories.major.includes(
                      product.dietCoachCategoryL1.de
                    ) ||
                      newCategories.sub.includes(
                        product.dietCoachCategoryL2.de
                      ))
                )
              );

            const newSelectedBasketProductsFlat =
              state.basketProductsFlat.filter((product) =>
                newSelectedBasketProductIds.some(
                  (id) =>
                    product.basketId === id.basketId &&
                    product.productId === id.productId
                )
              );

            return {
              selectedCategories: newCategories,
              selectedBasketProductIds: newSelectedBasketProductIds,
              selectedBasketProductsFlat: newSelectedBasketProductsFlat,
            };
          }
        } else {
          if (newCategories.sub.includes(category)) {
            // Deselect sub-category
            newCategories.sub = newCategories.sub.filter((i) => i !== category);

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

            // Remove deselected products from selectedBasketProductIds
            const newSelectedBasketProductIds =
              state.selectedBasketProductIds.filter(
                (id) =>
                  !state.basketProductsFlat.some(
                    (product) =>
                      product.basketId === id.basketId &&
                      product.productId === id.productId &&
                      product.dietCoachCategoryL2.de === category
                  )
              );

            const newSelectedBasketProductsFlat =
              state.basketProductsFlat.filter((product) =>
                newSelectedBasketProductIds.some(
                  (id) =>
                    product.basketId === id.basketId &&
                    product.productId === id.productId
                )
              );

            return {
              selectedCategories: newCategories,
              selectedBasketProductIds: newSelectedBasketProductIds,
              selectedBasketProductsFlat: newSelectedBasketProductsFlat,
            };
          } else {
            // Select sub-category
            newCategories.sub.push(category);

            // Automatically select the major category
            const majorCategory = state.basketProductsFlat.find(
              (product) => product.dietCoachCategoryL2.de === category
            )?.dietCoachCategoryL1.de;

            if (majorCategory && !newCategories.major.includes(majorCategory)) {
              newCategories.major.push(majorCategory);
            }

            const newSelectedBasketProductIds =
              state.selectedBasketProductIds.filter((id) =>
                state.basketProductsFlat.some(
                  (product) =>
                    product.basketId === id.basketId &&
                    product.productId === id.productId &&
                    (newCategories.major.includes(
                      product.dietCoachCategoryL1.de
                    ) ||
                      newCategories.sub.includes(
                        product.dietCoachCategoryL2.de
                      ))
                )
              );

            const newSelectedBasketProductsFlat =
              state.basketProductsFlat.filter((product) =>
                newSelectedBasketProductIds.some(
                  (id) =>
                    product.basketId === id.basketId &&
                    product.productId === id.productId
                )
              );

            return {
              selectedCategories: newCategories,
              selectedBasketProductIds: newSelectedBasketProductIds,
              selectedBasketProductsFlat: newSelectedBasketProductsFlat,
            };
          }
        }
      }),
    setSelectedMacro: (macro: MacroCategory) =>
      set(() => ({ selectedMacro: macro })),
    setSelectedMicro: (micro: MicroCategory) =>
      set(() => ({ selectedMicro: micro })),
  }));
};
