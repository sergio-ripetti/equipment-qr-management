const SERVER_URL = import.meta.env.VITE_API_URL;

// Returns the correct image URL for demo images or uploaded images
export function getMachineImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return "/img/maquina1.webp";
  }

  if (
    imageUrl.includes("maquina1") ||
    imageUrl.includes("maquina2") ||
    imageUrl.includes("maquina3")
  ) {
    return `/img/${imageUrl}`;
  }

  return `${SERVER_URL}/uploads/${imageUrl}`;
}
