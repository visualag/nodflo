import dbConnect from "@/lib/db";
import Exhibition from "@/models/Exhibition";
import Artist from "@/models/Artist";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function MinimalExhibitionPage({ params }: { params: Promise<{ slug: string }> }) {
    try {
        await dbConnect();
        const { slug } = await params;

        // Use a simple find without populate first to see if that's the issue
        const exhibition = await Exhibition.findOne({ slug }).lean() as any;

        if (!exhibition) return notFound();

        return (
            <div style={{ padding: 100, background: "#fff", minHeight: "100vh", color: "#000" }}>
                <Nav dark />
                <h1 style={{ marginTop: 100 }}>DEBUG: {exhibition.title}</h1>
                <p>Slug: {exhibition.slug}</p>
                <p>Status: {exhibition.type}</p>
                <div style={{ marginTop: 20 }}>
                    <p>Description length: {exhibition.description?.length || 0}</p>
                    <p>Artists array length: {exhibition.artists?.length || 0}</p>
                </div>
                <Footer />
            </div>
        );
    } catch (err: any) {
        return (
            <div style={{ padding: 100, background: "red", color: "white" }}>
                <h1>CRITICAL ERROR IN PAGE</h1>
                <pre>{err.message}</pre>
                <pre>{err.stack}</pre>
            </div>
        );
    }
}
