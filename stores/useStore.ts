import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  selectedCats: string[];
  selectedSortCriteria: string;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  setSelectedCats: (cats: string[]) => void;
  setSelectedSortCriteria: (criteria: string) => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return {
    count: new Date().getFullYear(),
    selectedCats: [],
    selectedSortCriteria: "Einkaufsdatum",
  };
};

export const defaultInitState: CounterState = {
  count: 0,
  selectedCats: [],
  selectedSortCriteria: "Einkaufsdatum",
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setSelectedCats: (cats: string[]) => set(() => ({ selectedCats: cats })),
    setSelectedSortCriteria: (criteria: string) =>
      set(() => ({ selectedSortCriteria: criteria })),
  }));
};
