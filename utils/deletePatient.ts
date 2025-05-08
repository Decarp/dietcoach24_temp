import axios from 'axios';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');


export const deletePatient = async (patientId: string, token: string): Promise<void> => {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`, {
        headers: {
            Authentication: token,
            'Participant-Id': patientId,
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to delete patient with ID: ${patientId}`);
    }
};
