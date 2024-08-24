import axios from "axios";

export const createPatient = async (patientId: string, token: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`,
      {},
      {
        headers: {
          Authentication: token,
          "Participant-Id": patientId,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(`Failed to add patient: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If the error is an AxiosError, use the message from Axios
      throw new Error(
        `Failed to add patient: ${error.response?.statusText || error.message}`
      );
    } else {
      // Handle unexpected errors
      throw new Error("An unexpected error occurred.");
    }
  }
};
