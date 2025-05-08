import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        const response = await fetch(imageUrl);
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const dataUrl = `data:${contentType};base64,${base64Image}`;

        return NextResponse.json({ dataUrl });
    } catch (error) {
        console.error('Error in image API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
