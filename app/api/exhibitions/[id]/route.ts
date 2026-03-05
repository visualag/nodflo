export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Exhibition from "@/models/Exhibition";
import { revalidatePath } from "next/cache";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await dbConnect();
    const exhibition = await Exhibition.findById(id);
    if (!exhibition) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exhibition);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        const { _id, __v, ...data } = body;
        const exhibition = await Exhibition.findById(id);
        if (!exhibition) return NextResponse.json({ error: "Exhibition not found" }, { status: 404 });
        Object.assign(exhibition, data);
        await exhibition.save();

        revalidatePath("/exhibitions");
        revalidatePath("/");
        if (exhibition.slug) revalidatePath(`/exhibitions/${exhibition.slug}`);

        return NextResponse.json(exhibition);
    } catch (err: any) {
        console.error("PUT /api/exhibitions error:", err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const exhibition = await Exhibition.findByIdAndDelete(id);

    revalidatePath("/exhibitions");
    revalidatePath("/");
    if (exhibition && exhibition.slug) revalidatePath(`/exhibitions/${exhibition.slug}`);

    return NextResponse.json({ success: true });
}
