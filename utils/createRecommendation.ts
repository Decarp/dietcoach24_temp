import axios from 'axios';
import { Omit } from 'lodash';
import { Recommendation } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const createRecommendation = async (
    data: Omit<Recommendation, 'recommendationId' | 'index'>,
    token: string,
    sessionId?: string,
): Promise<Recommendation> => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/dietician/recommendation`,
        {
            rule: data.rule,
            basketIds: data.basketIds,
            suggestions: data.suggestions,
            notes: data.notes,
        },
        {
            headers: {
                Authentication: token,
                'Session-Id': sessionId ? sessionId : '1',
                'Content-Type': 'application/json',
                Authorization: `Basic ${basicAuth}`,
            },
        },
    );

    if (response.status !== 201) {
        throw new Error(`Failed to create recommendation: ${response.statusText}`);
    }

    return response.data;
};
