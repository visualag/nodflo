
async function testDirectAPI() {
    const baseUrl = "https://nodflo.com"; // Test production directly if possible, or localhost
    const testUrl = `${baseUrl}/api/artists/67c5fd6a9531558509c13b27`; // Use a real ID if found, or test GET first

    console.log("Testing GET...");
    const getRes = await fetch(testUrl);
    if (!getRes.ok) {
        console.error("GET failed", getRes.status);
        return;
    }
    const artist = await getRes.json();
    console.log("Current Artist:", artist.name);

    console.log("Testing PUT update...");
    const { _id, __v, ...data } = artist;
    data.name = artist.name + " (Updated)";

    // We need session cookie for production, let's test LOCALHOST if running
    const localUrl = "http://localhost:3000/api/artists/" + artist._id;
    console.log("Testing LOCAL PUT at:", localUrl);

    try {
        const putRes = await fetch(localUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const putResult = await putRes.json();
        console.log("PUT Result:", putResult);
    } catch (e) {
        console.error("PUT Request failed:", e);
    }
}

testDirectAPI();
