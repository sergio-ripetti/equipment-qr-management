import cloudinary from "../config/cloudinary";

// Demo/default images live in the frontend public folder.
// These images are not stored in Cloudinary, so we should never try to delete them.
export function isDemoImage(imageUrl?: string): boolean {
  if (!imageUrl) return true;

  return (
    imageUrl.includes("maquina1") ||
    imageUrl.includes("maquina2") ||
    imageUrl.includes("maquina3")
  );
}

// Checks if the current image URL belongs to Cloudinary.
// This helps avoid trying to delete local/demo images as if they were Cloudinary images.
export function isCloudinaryImage(imageUrl?: string): boolean {
  if (!imageUrl) return false;

  return imageUrl.includes("res.cloudinary.com");
}

// Extracts the Cloudinary public_id from the full image URL.
// Cloudinary needs the public_id, not the full URL, to delete an image.
export function getCloudinaryPublicId(imageUrl?: string): string | null {
  if (!imageUrl || !isCloudinaryImage(imageUrl)) {
    return null;
  }

  const uploadIndex = imageUrl.indexOf("/upload/");

  if (uploadIndex === -1) {
    return null;
  }

  const pathAfterUpload = imageUrl.slice(uploadIndex + "/upload/".length);

  // Removes the version segment that Cloudinary adds, for example: v1234567890/
  const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

  // Removes the file extension, because Cloudinary public_id does not use it.
  return pathWithoutVersion.replace(/\.[^/.]+$/, "");
}

// Deletes an uploaded image from Cloudinary.
// Demo/default images are ignored because they are part of the frontend public assets.
export async function deleteUploadedImage(imageUrl?: string): Promise<void> {
  if (!imageUrl || isDemoImage(imageUrl)) {
    return;
  }

  const publicId = getCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}
