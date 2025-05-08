export async function register({
    email,
    password,
    firstName,
    lastName,
}: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    const backend_username = process.env.NEXT_PUBLIC_BACKEND_USERNAME;
    const backend_password = process.env.NEXT_PUBLIC_BACKEND_PASSWORD;
    const basicAuth = Buffer.from(`${backend_username}:${backend_password}`).toString('base64');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietician/register`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
        }),
    });

    return response;
}
