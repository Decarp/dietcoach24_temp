import { Sessions } from '@/types/types';

export const fetchSessions = async (patientId: string, token?: string): Promise<Sessions> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/sessions`, {
        method: 'GET',
        headers: {
            Authentication: token || '',
            'Participant-Id': patientId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch sessions');
    }

    return response.json();
};
