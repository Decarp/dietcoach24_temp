import { SelectedBasketProductId } from "@/types/types";
import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  selectedCategories: string[];
  selectedSortCriteria: string;
  selectedBasketIds: number[];
  selectedBasketProductIds: SelectedBasketProductId[];
  currentTab: string;
  patientId: string | null;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  setSelectedCategories: (cats: string[]) => void;
  setSelectedSortCriteria: (criteria: string) => void;
  setSelectedBasketIds: (ids: number[]) => void;
  setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) => void;
  setCurrentTab: (tab: string) => void;
  setPatientId: (id: string | null) => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return {
    count: new Date().getFullYear(),
    selectedCategories: [],
    selectedSortCriteria: "Einkaufsdatum",
    selectedBasketIds: [],
    selectedBasketProductIds: [],
    currentTab: "energy",
    patientId: null,
  };
};

export const defaultInitState: CounterState = {
  count: 0,
  selectedCategories: [],
  selectedSortCriteria: "Einkaufsdatum",
  selectedBasketIds: [],
  selectedBasketProductIds: [],
  currentTab: "energy",
  patientId: null,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setSelectedCategories: (cats: string[]) =>
      set(() => ({ selectedCategories: cats })),
    setSelectedSortCriteria: (criteria: string) =>
      set(() => ({ selectedSortCriteria: criteria })),
    setSelectedBasketIds: (ids: number[]) =>
      set(() => ({ selectedBasketIds: ids })),
    setSelectedBasketProductIds: (ids: SelectedBasketProductId[]) =>
      set(() => ({ selectedBasketProductIds: ids })),
    setCurrentTab: (tab: string) => set(() => ({ currentTab: tab })),
    setPatientId: (id: string | null) => set(() => ({ patientId: id })),
  }));
};
