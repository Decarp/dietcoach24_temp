export const deleteSession = async (sessionId: number, accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/session`, {
        method: 'DELETE',
        headers: {
            Authentication: accessToken,
            'Session-Id': sessionId.toString(),
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete the session');
    }

    return response;
};
