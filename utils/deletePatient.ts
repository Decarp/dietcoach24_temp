import axios from "axios";

export const deletePatient = async (
  patientId: string,
  token: string
): Promise<void> => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`,
    {
      headers: {
        Authentication: token,
        "Participant-Id": patientId,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to delete patient with ID: ${patientId}`);
  }
};
