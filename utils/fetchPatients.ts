import { Patient } from "@/types/types";

export const fetchPatients = async (token?: string): Promise<Patient[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/participants`,
    {
      method: "GET",
      headers: {
        Authentication: token || "",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
};
