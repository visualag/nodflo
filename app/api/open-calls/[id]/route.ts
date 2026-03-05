export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { OpenCall } from "@/models/OpenCall";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        const { _id, __v, ...data } = body;
        const call = await OpenCall.findById(id);
        if (!call) return NextResponse.json({ error: "Open Call not found" }, { status: 404 });
        Object.assign(call, data);
        await call.save();

        revalidatePath("/open-calls");
        revalidatePath("/");
        if (call.slug) revalidatePath(`/open-calls/${call.slug}`);

        return NextResponse.json(call);
    } catch (err: any) {
        console.error("PUT /api/open-calls error:", err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const call = await OpenCall.findByIdAndDelete(id);

    revalidatePath("/open-calls");
    revalidatePath("/");
    if (call && call.slug) revalidatePath(`/open-calls/${call.slug}`);

    return NextResponse.json({ success: true });
}
