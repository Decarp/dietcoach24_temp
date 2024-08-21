import { Sessions } from "@/types/types";

export const fetchSessions = async (patientId: string): Promise<Sessions> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/sessions`,
    {
      method: "GET",
      headers: {
        Authentication: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
        "Participant-Id": patientId,
      },
    }
  );
  return response.json();
};
