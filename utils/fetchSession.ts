import { Session } from '@/types/types';

const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const fetchSession = async (sessionId: number, token: string): Promise<Session> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/session`, {
        method: 'GET',
        headers: {
            Authentication: token,
            'Session-Id': sessionId.toString(),
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch session with ID: ${sessionId}`);
    }

    const session: Session = await response.json();
    return session;
};
