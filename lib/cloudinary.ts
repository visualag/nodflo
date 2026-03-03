import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;
function ensureConfigured() {
    if (isConfigured) return;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error("CRITICAL: Cloudinary environment variables are missing!", {
            CLOUDINARY_CLOUD_NAME: cloudName ? "EXISTS" : "MISSING",
            CLOUDINARY_API_KEY: apiKey ? "EXISTS" : "MISSING",
            CLOUDINARY_API_SECRET: apiSecret ? "EXISTS" : "MISSING",
        });
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
    console.log("Cloudinary: config() called with cloud_name:", cloudName || "EMPTY");
    isConfigured = true;
}

export async function uploadImage(
    fileBuffer: Buffer,
    folder: string = "nodflo"
): Promise<{ url: string; publicId: string }> {
    ensureConfigured();
    return new Promise((resolve, reject) => {
        console.log(`Cloudinary: Starting stream upload to folder "${folder}"...`);
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject(error);
                }
                if (!result) {
                    console.error("Cloudinary Upload Error: No result object returned");
                    return reject(new Error("Cloudinary upload failed: No result"));
                }
                console.log("Cloudinary Upload Success:", result.secure_url);
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );

        uploadStream.on("error", (err) => {
            console.error("Cloudinary Stream Error:", err);
            reject(err);
        });

        uploadStream.end(fileBuffer);
    });
}

export default cloudinary;
