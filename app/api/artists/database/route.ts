import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import ArtistContact from "@/models/ArtistContact";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const artists = await ArtistContact.find().sort({ lastAppliedDate: -1 });
    return NextResponse.json(artists);
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    await dbConnect();
    await ArtistContact.findByIdAndDelete(id);
    return NextResponse.json({ message: "Artist removed from database" });
}
