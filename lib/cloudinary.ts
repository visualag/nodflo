import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
    fileBuffer: Buffer,
    folder: string = "nodflo"
): Promise<{ url: string; publicId: string }> {
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
