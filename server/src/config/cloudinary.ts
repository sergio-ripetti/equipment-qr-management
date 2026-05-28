import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Loads environment variables before configuring Cloudinary.
// This is important because this file can be imported before index.ts runs dotenv.config().
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("Cloudinary environment variables are not fully configured.");
}

// Configures Cloudinary with the credentials from .env.
// These values are required to upload and delete images.
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
