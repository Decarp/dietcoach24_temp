import { Patient } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const fetchPatientDetails = async (patientId: string, token?: string): Promise<Patient> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`, {
        method: 'GET',
        headers: {
            Authentication: token || '',
            'Participant-Id': patientId,
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch patient');
    }

    return response.json();
};
