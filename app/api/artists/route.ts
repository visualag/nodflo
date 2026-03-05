export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Artist from "@/models/Artist";
import { revalidatePath } from "next/cache";

function serializeDoc(doc: any) {
    if (!doc) return doc;
    const serialized = { ...doc, _id: doc._id.toString() };
    if (serialized.createdAt) serialized.createdAt = new Date(serialized.createdAt).toISOString();
    if (serialized.updatedAt) serialized.updatedAt = new Date(serialized.updatedAt).toISOString();
    if (serialized.visibilityEnd) serialized.visibilityEnd = new Date(serialized.visibilityEnd).toISOString();
    return serialized;
}

export async function GET() {
    await dbConnect();
    const now = new Date();

    // Fetch all artists who have NOT expired
    const artists = await Artist.find({
        $or: [
            { visibilityEnd: { $gt: now } },
            { visibilityEnd: { $exists: false } },
            { visibilityEnd: null }
        ]
    }).lean();

    const membershipOrder = { 'Platinum': 1, 'Gold': 2, 'Silver': 3, 'Bronze': 4 };

    artists.sort((a, b) => {
        const rankA = membershipOrder[a.membership as keyof typeof membershipOrder] || 4;
        const rankB = membershipOrder[b.membership as keyof typeof membershipOrder] || 4;

        if (rankA !== rankB) return rankA - rankB;

        // If both Platinum, sort by order
        if (a.membership === 'Platinum') {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;
            if (orderA !== orderB) return orderA - orderB;
        }

        // Default to alphabetical by name
        return a.name.localeCompare(b.name);
    });

    return NextResponse.json(artists.map(serializeDoc));
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const data = await req.json();
    const artist = await Artist.create(data);

    // Instant Invalidaton for Frontpage and Public Listings
    revalidatePath("/artists");
    revalidatePath("/");

    return NextResponse.json(serializeDoc(artist.toObject()), { status: 201 });
}
