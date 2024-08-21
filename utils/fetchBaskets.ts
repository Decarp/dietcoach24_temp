import { Basket } from "@/types/types";

export const fetchBaskets = async (
  patientId: string,
  startTimestamp: string,
  endTimestamp: string
): Promise<Basket[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/baskets`,
    {
      method: "GET",
      headers: {
        Authentication: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
        "Participant-Id": patientId,
        "Start-Timestamp": startTimestamp,
        "End-Timestamp": endTimestamp,
      },
    }
  );
  return response.json();
};
