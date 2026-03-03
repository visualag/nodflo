import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { OpenCallApplication } from "@/models/OpenCall";
import { OpenCall } from "@/models/OpenCall";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const data = await req.json();
    const call = await OpenCall.findById(params.id);
    if (!call || !call.isActive) {
        return NextResponse.json({ error: "This open call is not active" }, { status: 400 });
    }
    const application = await OpenCallApplication.create({
        ...data,
        callId: params.id,
        callTitle: call.title,
    });
    return NextResponse.json(application, { status: 201 });
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await (await import("next-auth")).getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const applications = await OpenCallApplication.find({ callId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(applications);
}
