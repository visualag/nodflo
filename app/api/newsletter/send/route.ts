import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { sendEmail, newsletterTemplate } from "@/lib/email";

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, body } = await req.json();
    if (!subject || !body) return NextResponse.json({ error: "Subject and body required" }, { status: 400 });

    await dbConnect();
    const subscribers = await NewsletterSubscriber.find({ isActive: true }).select("email");
    const emails = subscribers.map((s: any) => s.email);

    if (emails.length === 0) return NextResponse.json({ error: "No subscribers" }, { status: 400 });

    try {
        await sendEmail({
            to: emails,
            subject,
            html: newsletterTemplate({ subject, body }),
        });
        return NextResponse.json({ success: true, sent: emails.length });
    } catch (err) {
        console.error("Email send error:", err);
        return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
    }
}
