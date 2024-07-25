import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  selectedCats: string[];
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  setSelectedCats: (cats: string[]) => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return { count: new Date().getFullYear(), selectedCats: [] };
};

export const defaultInitState: CounterState = {
  count: 0,
  selectedCats: [],
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setSelectedCats: (cats: string[]) => set(() => ({ selectedCats: cats })),
  }));
};
