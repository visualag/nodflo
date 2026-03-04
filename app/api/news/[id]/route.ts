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
    try {
        const body = await req.json();
        console.log("PUT /api/news/" + params.id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;
        const news = await News.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
        console.log("Update successful:", news ? "FOUND" : "NOT FOUND");
        return NextResponse.json(news);
    } catch (err: any) {
        console.error("PUT /api/news error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await News.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
