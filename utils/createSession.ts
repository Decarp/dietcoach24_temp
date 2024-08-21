import { Session } from "@/types/types";

export const createSession = async (patientId: string): Promise<Session> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/session`,
    {
      method: "POST",
      headers: {
        Authentication: process.env.NEXT_PUBLIC_AUTH_TOKEN!,
        "Participant-Id": patientId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }

  return response.json();
};
