import { BasketProduct } from "@/types/types";

export const fetchBasketProducts = async (
  patientId: string,
  selectedBasketIds: string[]
): Promise<BasketProduct[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/basket-products`,
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
