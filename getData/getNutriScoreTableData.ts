import { nutriScoreTableResponse } from "@/data/nutriScoreTableResponse";

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

const fetchData = (selectedBasketIds: string[]): NutriScoreTableResponse[] => {
  const authentication = ""; // via local storage
  const participantId = ""; // via url param
  return nutriScoreTableResponse;
};

export const getNutriScoreTableData = (
  selectedBasketIds: string[] = [],
  language: string = "de"
): NutriScoreTableData[] => {
  const data = fetchData(selectedBasketIds);

  // Only keep the language specified in the function parameter, and ensure NutriScoreTableData is returned
  let filteredData = data.map((item) => {
    return {
      category: item.category[language as "de" | "en"],
      quantity: item.quantity,
      energyKj: item.energyKj,
      energy: item.energy,
      sugar: item.sugar,
      saturatedFat: item.saturatedFat,
      sodium: item.sodium,
      fruitVegetables: item.fruitVegetables,
      fiber: item.fiber,
      protein: item.protein,
    };
  });

  // Filter out rows where "Ausgeschlossen" appears in the category
  filteredData = filteredData.filter(
    (item) => !item.category.some((cat: string) => cat === "Ausgeschlossen")
  );

  return filteredData;
};
