export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Sponsor from "@/models/Sponsor";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    try {
        const body = await req.json();
        console.log("PUT /api/sponsors/" + id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;

        const sponsor = await Sponsor.findById(id);
        if (!sponsor) {
            console.log("Sponsor not found for ID:", id);
            return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
        }

        Object.assign(sponsor, data);
        await sponsor.save();

        console.log("Update successful for sponsor:", sponsor.name);
        return NextResponse.json(sponsor);
    } catch (err: any) {
        console.error("PUT /api/sponsors error:", err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await Sponsor.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
