import { Patient } from '@/types/types';

export const fetchPatientDetails = async (patientId: string, token?: string): Promise<Patient> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/participant`, {
        method: 'GET',
        headers: {
            Authentication: token || '',
            'Participant-Id': patientId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch patient');
    }

    return response.json();
};
