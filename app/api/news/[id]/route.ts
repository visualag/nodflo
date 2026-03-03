import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import News from "@/models/News";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const news = await News.findById(params.id);
    if (!news) return NextResponse.json({ error: "News not found" }, { status: 404 });
    return NextResponse.json(news);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const data = await req.json();
    const news = await News.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(news);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await News.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
