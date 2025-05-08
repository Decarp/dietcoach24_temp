import { NutrientTableResponseItem } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const fetchNutrientTable = async (
    patientId: string,
    selectedBasketIds: string[],
    token: string
): Promise<NutrientTableResponseItem[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/nutrient-table`, {
        method: 'POST',
        headers: {
            Authentication: token,
            'Participant-Id': patientId,
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
            basketIds: selectedBasketIds,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch nutrient table: ${response.statusText}`);
    }

    return response.json();
};
