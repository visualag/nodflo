import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { OpenCallApplication } from "@/models/OpenCall";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    try {
        const application = await OpenCallApplication.findById(id);
        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const publicIds = application.images.map((img: any) => img.publicId).filter(Boolean);

        if (publicIds.length > 0) {
            // Delete from Cloudinary
            await new Promise((resolve, reject) => {
                cloudinary.api.delete_resources(publicIds, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        }

        // Clear from DB
        application.images = [];
        await application.save();

        return NextResponse.json({ message: "Assets deleted successfully" });
    } catch (error: any) {
        console.error("Deletion error:", error);
        return NextResponse.json({ error: "Failed to delete assets" }, { status: 500 });
    }
}
