// -------------------
// Product
// -------------------

export type Nutrients = {
  kcal: number;
  proteins: number;
  fats: number;
  saturatedFats: number;
  carbohydrates: number;
  sugars: number;
  fibres: number;
  salt: number;
  sodium: number;
  fsaScore: number;
  nutriScore: string;
};

export type DietCoachCategory = {
  de: string;
  en: string;
};

export type Product = {
  gtin: number;
  name: string;
  quantity: number;
  nutrients: Nutrients;
  dietCoachCategoryL1: DietCoachCategory;
  dietCoachCategoryL2: DietCoachCategory;
  imageUrl: string;
};

export type DatabaseNutrients = {
  kcal: number;
  proteins: number;
  fats: number;
  saturatedFats: number;
  carbohydrates: number;
  sugars: number;
  fibers: number;
  salt: number;
  sodium: number;
};

export type NutriScoreV2023Detail = {
  nutriScoreCalculated: string;
  nsPoints: number;
};

export type DatabaseProduct = {
  productId: number;
  gtins: number[];
  de: {
    name: string;
  };
  productSize: number;
  nutrients: DatabaseNutrients;
  nutriScoreV2023Detail: NutriScoreV2023Detail;
  dietCoachCategoryL1: DietCoachCategory;
  dietCoachCategoryL2: DietCoachCategory;
  imageUrl: string;
  base64Image?: string;
};

export type DatabaseProducts = {
  products: DatabaseProduct[];
  meta: {
    totalPages: number;
    totalProducts: number;
  };
};

export type CategorySelection = { major: string[]; sub: string[] };

// -------------------
// Basket
// -------------------

export type Basket = {
  basketId: string;
  index: number;
  timestamp: number;
  avgNutriScore: string | null;
  avgFsaScore: number | null;
};

export type Baskets = {
  [month: string]: Basket[];
};

export type BasketProduct = {
  basketId: string;
  index: number;
  timestamp: number;
  avgNutriScore: string | null;
  avgFsaScore: number | null;
  products: Product[];
};

export type BasketProductFlat = {
  basketId: string;
  basketIndex: number;
  basketTimestamp: number;
  gtin: number;
  name: string;
  quantity: number;
  nutrients: Nutrients;
  dietCoachCategoryL1: DietCoachCategory;
  dietCoachCategoryL2: DietCoachCategory;
  imageUrl: string;
};

export type SelectedBasketIds = string[];

export type SelectedBasketProductId = {
  basketId: string;
  gtin: number;
};

// -------------------
// Charts
// -------------------

export type MetricOptions = "g";

export type LanguageOptions = "en" | "de";

export type MacroCategory =
  | "Kohlenhydrate"
  | "Fette"
  | "Proteine"
  | "Nahrungsfasern";

export type MicroCategory = "Salz" | "Zucker" | "Gesättigte Fettsäuren";

export type ChartEnergyMacroResponse = {
  name: {
    de: string;
    en: string;
  };
  grams: number;
};

export type ChartEnergyMacroData = {
  name: string;
  value: number;
};

export type ChartEnergyCategoriesResponse = {
  name: {
    de: string;
    en: string;
  };
  grams: number;
};

export type ChartEnergyCategoriesData = {
  name: string;
  value: number;
};

export type NutriScoreTableResponse = {
  category: {
    de: string[];
    en: string[];
  };
  quantity: number;
  energyKj: number;
  energy: number;
  sugar: number;
  saturatedFat: number;
  sodium: number;
  fruitVegetables: number;
  fiber: number;
  protein: number;
};

export type NutriScoreTableData = {
  category: string[];
  quantity: number;
  energyKj: number;
  energy: number;
  sugar: number;
  saturatedFat: number;
  sodium: number;
  fruitVegetables: number;
  fiber: number;
  protein: number;
};

// -------------------
// Sessions
// -------------------

export type Sessions = {
  sessionId: number;
  index: number;
  timestamp: number;
}[];

export type RecommendationRule = {
  variant: string;
  mode: string | null;
  nutrient: string | null;
  category: string | null;
  text: string | null;
};

export type Recommendation = {
  recommendationId: number;
  index: number;
  rule: RecommendationRule;
  basketIds: string[];
  suggestions: {
    current: number[];
    alternatives: number[];
  };
  notes: string | null;
};

export type EnrichedRecommendation = {
  recommendationId: number;
  index: number;
  rule: RecommendationRule;
  basketIds: string[];
  suggestions: {
    current: DatabaseProduct[];
    alternatives: DatabaseProduct[];
  };
  notes: string | null;
};

export type Session = {
  sessionId: number;
  index: number;
  timestamp: number;
  recommendations: Recommendation[];
  notes: {
    patient: string | null;
    personal: string | null;
  };
};

// -------------------
// Patients
// -------------------

export type PatientProfile = {
  imageUrl: string | null;
  firstName: string;
  lastName: string;
};

export type Demographics = {
  age: number;
  gender: "M" | "F" | "Other";
  weight: number;
  height: number;
};

export type MedicalHistory = {
  diagnosis: string;
  bmi: number;
  ffqDate: number;
  ffqUrl: string;
};

export type ShoppingFrequency = {
  migros: string;
  coop: string;
  other: string;
};

export type LoyaltyCardUsage = {
  migros: string;
  coop: string;
};

export type Patient = {
  externalId: string;
  profile: PatientProfile;
  demographics: Demographics;
  medicalHistory: MedicalHistory;
  householdSize: number;
  shoppingFrequency: ShoppingFrequency;
  loyaltyCardUsage: LoyaltyCardUsage;
};

// -------------------
// Nutrient Table
// -------------------

export type Category = {
  de: string;
  en: string;
  fr?: string;
  it?: string;
};

export type NutrientTableResponseItem = {
  EnergyShare: number | null;
  Quantity: number | null;
  EnergyKJ: number | null;
  Sugars: number | null;
  Salt: number | null;
  Saturates: number | null;
  Fibres: number | null;
  FVL: number | null; // Fruits, Vegetables, and Legumes
  Proteins: number | null;
  MajorCategory: Category;
  MinorCategory: Category | null;
};

export type NutrientTableItem = {
  Category: [string] | [string, string];
  EnergyShare: number | null;
  Quantity: number | null;
  EnergyKJ: number | null;
  Sugars: number | null;
  Salt: number | null;
  Saturates: number | null;
  Fibres: number | null;
  FVL: number | null; // Fruits, Vegetables, and Legumes
  Proteins: number | null;
  MajorCategory: Category;
};
