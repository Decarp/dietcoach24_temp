import axios from "axios";

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(
  `${backend_username}:${backend_password}`,
).toString("base64");

export const createPatient = async (patientId: string, token: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`,
      {},
      {
        headers: {
          Authentication: token,
          "Participant-Id": patientId,
          Authorization: `Basic ${basicAuth}`,
        },
      },
    );

    if (response.status !== 201) {
      throw new Error(`Failed to add patient: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If the error is an AxiosError, use the message from Axios
      throw new Error(
        `Failed to add patient: ${error.response?.statusText || error.message}`,
      );
    } else {
      // Handle unexpected errors
      throw new Error("An unexpected error occurred.");
    }
  }
};
