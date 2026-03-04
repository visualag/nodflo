import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Artist from "@/models/Artist";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const artist = await Artist.findById(params.id);
    if (!artist) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(artist);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        console.log("PUT /api/artists/" + params.id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;
        const artist = await Artist.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
        console.log("Update successful:", artist ? "FOUND" : "NOT FOUND");
        return NextResponse.json(artist);
    } catch (err: any) {
        console.error("PUT /api/artists error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await Artist.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
