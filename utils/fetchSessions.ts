import { Sessions } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const fetchSessions = async (patientId: string, token?: string): Promise<Sessions> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/sessions`, {
        method: 'GET',
        headers: {
            Authentication: token || '',
            'Participant-Id': patientId,
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch sessions');
    }

    return response.json();
};
