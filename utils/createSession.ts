import { Session } from "@/types/types";

export const createSession = async (
  patientId: string,
  token: string
): Promise<Session> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/session`,
    {
      method: "POST",
      headers: {
        Authentication: token,
        "Participant-Id": patientId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }

  return response.json();
};
