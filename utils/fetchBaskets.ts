import { Basket } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const fetchBaskets = async (
    patientId: string,
    startTimestamp: string,
    endTimestamp: string,
    token: string
): Promise<Basket[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/baskets`, {
        method: 'GET',
        headers: {
            Authentication: token,
            'Participant-Id': patientId,
            'Start-Timestamp': startTimestamp,
            'End-Timestamp': endTimestamp,
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch baskets: ${response.statusText}`);
    }

    return response.json();
};
