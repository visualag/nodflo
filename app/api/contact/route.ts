import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactInquiry from "@/models/ContactInquiry";

export async function POST(req: NextRequest) {
    await dbConnect();
    const data = await req.json();
    if (!data.name || !data.email || !data.message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const inquiry = await ContactInquiry.create(data);
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
}

export async function GET() {
    const session = await (await import("next-auth")).getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const inquiries = await ContactInquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
}
