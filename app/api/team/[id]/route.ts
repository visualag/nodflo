export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        console.log("PUT /api/team/" + id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;

        const member = await TeamMember.findById(id);
        if (!member) {
            console.log("Team member not found for ID:", id);
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        Object.assign(member, data);
        await member.save();

        console.log("Update successful for member:", member.name);
        return NextResponse.json(member);
    } catch (err: any) {
        console.error("PUT /api/team error:", err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await TeamMember.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
