// -------------------
// Product
// -------------------

export type Nutrients = {
  nutriScore: string;
  fsaScore: number;
  kcal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  fibers: number;
  salt: number;
};

export type DietCoachCategory = {
  de: string;
  en: string;
};

export type Product = {
  productId: number;
  name: string;
  quantity: number;
  nutrients: Nutrients;
  dietCoachCategoryL1: DietCoachCategory;
  dietCoachCategoryL2: DietCoachCategory;
  imageUrl: string;
};

// -------------------
// Basket
// -------------------

export type Basket = {
  basketId: number;
  index: number;
  timestamp: number;
  avgNutriScore: string;
  avgFsaScore: number;
};

export type BasketProduct = {
  basketId: number;
  index: number;
  timestamp: number;
  avgNutriScore: string;
  avgFsaScore: number;
  products: Product[];
};

export type BasketProductFlat = {
  basketId: number;
  basketIndex: number;
  basketTimestamp: number;
  productId: number;
  name: string;
  quantity: number;
  nutrients: Nutrients;
  dietCoachCategoryL1: DietCoachCategory;
  dietCoachCategoryL2: DietCoachCategory;
  imageUrl: string;
};

export type SelectedBasketIds = number[];

export type SelectedBasketProductId = {
  basketId: number;
  productId: number;
};

// -------------------
// Charts
// -------------------

export type MetricOptions = "kcal" | "g";

export type LanguageOptions = "en" | "de";

export type ChartEnergyMacroResponse = {
  name: {
    de: string;
    en: string;
  };
  values: {
    kcal: number;
    g: number;
  };
};

export type ChartEnergyMacroData = {
  name: string;
  value: number;
  metric: string;
};

export type ChartEnergyCategoriesResponse = {
  name: {
    de: string;
    en: string;
  };
  values: {
    kcal: number;
    g: number;
  };
};

export type ChartEnergyCategoriesData = {
  name: string;
  value: number;
  metric: string;
};
