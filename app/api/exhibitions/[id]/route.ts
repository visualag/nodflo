import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Exhibition from "@/models/Exhibition";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const exhibition = await Exhibition.findById(params.id);
    if (!exhibition) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exhibition);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { _id, __v, ...data } = await req.json();
    const exhibition = await Exhibition.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(exhibition);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await Exhibition.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
