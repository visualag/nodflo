import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { OpenCall } from "@/models/OpenCall";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    try {
        const body = await req.json();
        console.log("PUT /api/open-calls/" + params.id + " received:", JSON.stringify(body, null, 2));
        const { _id, __v, ...data } = body;
        const call = await OpenCall.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
        console.log("Update successful:", call ? "FOUND" : "NOT FOUND");
        return NextResponse.json(call);
    } catch (err: any) {
        console.error("PUT /api/open-calls error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    await OpenCall.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
