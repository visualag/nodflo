import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const originalFilename = searchParams.get('filename');

    if (!originalFilename || !request.body) {
        return NextResponse.json({ error: 'Filename and body required' }, { status: 400 });
    }

    // Add timestamp to avoid filename collisions
    const ext = originalFilename.includes('.') ? originalFilename.split('.').pop() : '';
    const base = originalFilename.replace(/\.[^/.]+$/, '');
    const uniqueFilename = `${base}-${Date.now()}${ext ? '.' + ext : ''}`;

    try {
        const blob = await put(uniqueFilename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error: any) {
        console.error('Blob upload error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
