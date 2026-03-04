export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import News from "@/models/News";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await dbConnect();
    const news = await News.findById(id);
    if (!news) return NextResponse.json({ error: "News not found" }, { status: 404 });
    return NextResponse.json(news);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        console.log("PUT /api/news/" + id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;

        const item = await News.findById(id);
        if (!item) {
            console.log("News item not found for ID:", id);
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        Object.assign(item, data);
        await item.save();

        console.log("Update successful for news item:", item.title);
        return NextResponse.json(item);
    } catch (err: any) {
        console.error("PUT /api/news error:", err);
        return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await News.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
