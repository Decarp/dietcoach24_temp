import { Patient } from "@/types/types";

export const fetchPatient = async (patientId: string): Promise<Patient> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`,
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
