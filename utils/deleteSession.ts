const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const deleteSession = async (sessionId: number, accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/session`, {
        method: 'DELETE',
        headers: {
            Authentication: accessToken,
            'Session-Id': sessionId.toString(),
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete the session');
    }

    return response;
};
