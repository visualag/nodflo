export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Artist from "@/models/Artist";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        const { _id, __v, ...data } = body;
        const artist = await Artist.findById(id);
        if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        Object.assign(artist, data);
        await artist.save();

        revalidatePath("/artists");
        revalidatePath("/");
        if (artist.slug) revalidatePath(`/artists/${artist.slug}`);

        return NextResponse.json(artist);
    } catch (err: any) {
        console.error("PUT /api/artists error:", err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const artist = await Artist.findByIdAndDelete(id);

    revalidatePath("/artists");
    revalidatePath("/");
    if (artist && artist.slug) revalidatePath(`/artists/${artist.slug}`);

    return NextResponse.json({ success: true });
}
