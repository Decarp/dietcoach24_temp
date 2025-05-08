const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

export const deleteRecommendation = async (recommendationId: number, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/recommendation`, {
        method: 'DELETE',
        headers: {
            Authentication: token,
            'Recommendation-Id': recommendationId.toString(),
            Authorization: `Basic ${basicAuth}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete recommendation');
    }

    return response;
};
