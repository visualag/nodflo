import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { _id, __v, ...data } = await req.json();
    const member = await TeamMember.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(member);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await TeamMember.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
