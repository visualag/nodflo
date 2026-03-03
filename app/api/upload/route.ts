import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "nodflo";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`API Upload: Processing file "${file.name}" (${file.size} bytes) for folder "${folder}"`);
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadImage(buffer, folder);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Upload Exception:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        }, { status: 500 });
    }
}
