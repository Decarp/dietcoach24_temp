import { NutrientTableResponseItem } from "@/types/types";

export const fetchNutrientTable = async (
  patientId: string,
  selectedBasketIds: string[]
): Promise<NutrientTableResponseItem[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/nutrient-table`,
    {
      method: "POST",
      headers: {
        Authentication: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
        "Participant-Id": patientId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        basketIds: selectedBasketIds,
      }),
    }
  );
  return response.json();
};
