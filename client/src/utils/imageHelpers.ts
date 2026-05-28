const API_URL = import.meta.env.VITE_API_URL;

// Returns the correct image URL depending on where the image is stored.
export function getMachineImageUrl(imageUrl?: string): string {
  // If there is no image, use the default demo image.
  if (!imageUrl) {
    return "/img/maquina1.webp";
  }

  // Cloudinary images are already full URLs.
  // They should be returned directly without adding the backend URL.
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Demo/default images live inside the frontend public/img folder.
  if (
    imageUrl.includes("maquina1") ||
    imageUrl.includes("maquina2") ||
    imageUrl.includes("maquina3")
  ) {
    return `/img/${imageUrl}`;
  }

  // Old uploaded images fallback.
  // This supports old records that still have only a filename from server/uploads.
  return `${API_URL}/uploads/${imageUrl}`;
}
