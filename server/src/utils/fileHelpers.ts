import fs from "fs";
import path from "path";

// Uploaded images are stored in server/uploads
const uploadsFolder = path.join(__dirname, "../../uploads");

// Demo images live in the React public/img folder, so we must not delete them
function isDemoImage(imageUrl?: string): boolean {
  if (!imageUrl) return true;

  return (
    imageUrl.includes("maquina1") ||
    imageUrl.includes("maquina2") ||
    imageUrl.includes("maquina3")
  );
}

// Deletes an uploaded image from server/uploads
export function deleteUploadedImage(imageUrl?: string): void {
  if (!imageUrl || isDemoImage(imageUrl)) {
    return;
  }

  const imagePath = path.join(uploadsFolder, imageUrl);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
}
