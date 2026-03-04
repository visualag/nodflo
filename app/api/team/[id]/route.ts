import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        console.log("PUT /api/team/" + params.id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;
        const member = await TeamMember.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
        console.log("Update successful:", member ? "FOUND" : "NOT FOUND");
        return NextResponse.json(member);
    } catch (err: any) {
        console.error("PUT /api/team error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await TeamMember.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
