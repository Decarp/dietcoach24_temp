import { BasketProductFlat, SelectedBasketProductId } from "@/types/types";
import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  selectedCategories: { major: string[]; sub: string[] };
  selectedSortCriteria: string;
  selectedBasketIds: number[];
  selectedBasketProductIds: SelectedBasketProductId[];
  currentTab: string;
  patientId: string | null;
  basketProductsFlat: BasketProductFlat[];
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  setSelectedCategories: (cats: { major: string[]; sub: string[] }) => void;
  setSelectedSortCriteria: (criteria: string) => void;
  setSelectedBasketIds: (ids: number[]) => void;
  setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) => void;
  setCurrentTab: (tab: string) => void;
  setPatientId: (id: string | null) => void;
  setBasketProductsFlat: (products: BasketProductFlat[]) => void;
  updateCategories: (category: string, level: "major" | "sub") => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return {
    count: new Date().getFullYear(),
    selectedCategories: { major: [], sub: [] },
    selectedSortCriteria: "Einkaufsdatum",
    selectedBasketIds: [],
    selectedBasketProductIds: [],
    currentTab: "energy",
    patientId: null,
    basketProductsFlat: [],
  };
};

export const defaultInitState: CounterState = {
  count: 0,
  selectedCategories: { major: [], sub: [] },
  selectedSortCriteria: "Einkaufsdatum",
  selectedBasketIds: [],
  selectedBasketProductIds: [],
  currentTab: "energy",
  patientId: null,
  basketProductsFlat: [],
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setSelectedCategories: (cats: { major: string[]; sub: string[] }) =>
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

        return {
          selectedCategories: cats,
          selectedBasketProductIds: newSelectedBasketProductIds,
        };
      }),
    setSelectedSortCriteria: (criteria: string) =>
      set(() => ({ selectedSortCriteria: criteria })),
    setSelectedBasketIds: (ids: number[]) =>
      set(() => ({ selectedBasketIds: ids })),
    setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) =>
      set(() => ({ selectedBasketProductIds: ids })),
    setCurrentTab: (tab: string) => set(() => ({ currentTab: tab })),
    setPatientId: (id: string | null) => set(() => ({ patientId: id })),
    setBasketProductsFlat: (products: BasketProductFlat[]) =>
      set(() => ({ basketProductsFlat: products })),
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
            return {
              selectedCategories: newCategories,
              selectedBasketProductIds: newSelectedBasketProductIds,
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
            return { selectedCategories: newCategories };
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
            return {
              selectedCategories: newCategories,
              selectedBasketProductIds: newSelectedBasketProductIds,
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
            return { selectedCategories: newCategories };
          }
        }
      }),
  }));
};
