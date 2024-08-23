import { Basket } from "@/types/types";

export const fetchBaskets = async (
  patientId: string,
  startTimestamp: string,
  endTimestamp: string,
  token: string
): Promise<Basket[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/baskets`,
    {
      method: "GET",
      headers: {
        Authentication: token,
        "Participant-Id": patientId,
        "Start-Timestamp": startTimestamp,
        "End-Timestamp": endTimestamp,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch baskets: ${response.statusText}`);
  }

  return response.json();
};
