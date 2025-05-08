const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const createNote = async (newNote: string, sessionId: number, accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/session-note`, {
        method: 'POST',
        headers: {
            Authentication: accessToken,
            'Session-Id': sessionId.toString(),
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
            notes: {
                patient: newNote,
                personal: '', // not used for now
            },
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to post the note');
    }

    return response;
};
