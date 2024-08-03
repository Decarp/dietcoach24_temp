// -------------------
// Product
// -------------------

export type Nutrients = {
  kcal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  fibers: number;
  salt: number;
};

export type NutriScoreV2023Detail = {
  nutriScoreCalculated: string;
  nsPoints: number;
};

export type DietCoachCategory = {
  de: string;
  en: string;
};

export type Product = {
  productId: number;
  de: {
    name: string;
  };
  productSize: number;
  nutrients: Nutrients;
  nutriScoreV2023Detail: NutriScoreV2023Detail;
  dietCoachCategoryL1: DietCoachCategory;
  dietCoachCategoryL2: DietCoachCategory;
  imageUrl: string;
};

export type Products = {
  products: Product[];
  meta: {
    totalPages: number;
    totalProducts: number;
  };
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
  de: {
    name: string;
  };
  productSize: number;
  nutrients: Nutrients;
  nutriScoreV2023Detail: NutriScoreV2023Detail;
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

export type MacroCategory =
  | "Kohlenhydrate"
  | "Fette"
  | "Proteine"
  | "Nahrungsfasern";

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
