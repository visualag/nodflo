import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { OpenCall } from "@/models/OpenCall";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { _id, __v, ...data } = await req.json();
    const call = await OpenCall.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(call);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await OpenCall.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
