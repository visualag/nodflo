const mongoose = require('mongoose');

// Dummy schema to match whatever is there
const GenericSchema = new mongoose.Schema({}, { strict: false });

async function dumpData() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('MONGODB_URI missing');
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('DB Connected');

    const OpenCall = mongoose.models.OpenCall || mongoose.model('OpenCall', GenericSchema, 'opencalls');
    const Artist = mongoose.models.Artist || mongoose.model('Artist', GenericSchema, 'artists');

    console.log('\n--- Open Calls ---');
    const calls = await OpenCall.find({});
    calls.forEach(c => {
        console.log(`Title: ${c.title}, Cover: ${c.coverImage || 'NONE'}`);
    });

    console.log('\n--- Artists ---');
    const artists = await Artist.find({});
    artists.forEach(a => {
        console.log(`Name: ${a.name}, Slug: ${a.slug}`);
    });

    await mongoose.disconnect();
    process.exit(0);
}

dumpData().catch(err => {
    console.error('Dump failed:', err);
    process.exit(1);
});
