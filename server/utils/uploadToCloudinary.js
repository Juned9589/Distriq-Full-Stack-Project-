import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: 'dyfxrhlby',
    api_key: '664234376222747',
    api_secret: 'v8C4J55wtUnj-6a7M46LtEBQlRM'
});

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "events",
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

export default uploadToCloudinary;