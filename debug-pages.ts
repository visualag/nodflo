import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://artgrup_db_user:TsJDgFDMjRxU98rI@cluster0.vm3qgem.mongodb.net/?appName=Cluster0"

async function debug() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    if (!db) {
        console.error("No database connection");
        process.exit(1);
    }
    const pages = await db.collection("pagecontents").find({}).toArray();
    console.log("Total pages records:", pages.length);
    pages.forEach(p => {
        console.log("---");
        console.log("Slug:", p.slug);
        console.log("Title:", p.title);
        console.log("Subtitle:", p.subtitle);
        console.log("Description:", !!p.description);
    });
    process.exit(0);
}

debug();
