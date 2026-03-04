import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://artgrup_db_user:TsJDgFDMjRxU98rI@cluster0.vm3qgem.mongodb.net/?appName=Cluster0"

const DEFAULTS = [
    { slug: "home", title: "NOD FLOW", subtitle: "Contemporary Art Gallery", description: "NOD FLOW is a contemporary art gallery presenting groundbreaking exhibitions." },
    { slug: "artists", title: "Artists", subtitle: "Our Roster", description: "Discover the artists we represent." },
    { slug: "exhibitions", title: "Exhibitions", subtitle: "Now & Next", description: "Explore current and upcoming presentations." },
    { slug: "news", title: "News & Press", subtitle: "Latest Updates", description: "Stay informed about gallery events." },
    { slug: "team", title: "Team", subtitle: "About Us", description: "The people behind the gallery." },
    { slug: "sponsors", title: "Sponsors & Partners", subtitle: "Our Community", description: "Supporting the arts together." },
    { slug: "contact", title: "Contact", subtitle: "Visit Us", description: "Get in touch with the gallery." },
    { slug: "open-calls", title: "Open Calls", subtitle: "Opportunities", description: "Apply to exhibit with us." },
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    if (!db) return;

    for (const d of DEFAULTS) {
        await db.collection("pagecontents").updateOne(
            { slug: d.slug },
            { $setOnInsert: d },
            { upsert: true }
        );
    }
    console.log("Seeded default page contents.");
    process.exit(0);
}

seed();
