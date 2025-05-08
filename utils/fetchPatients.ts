import { Patient } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const fetchPatients = async (token?: string): Promise<Patient[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/participants`, {
        method: 'GET',
        headers: {
            Authentication: token || '',
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch patients');
    }

    return response.json();
};
