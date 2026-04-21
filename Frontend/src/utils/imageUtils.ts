/**
 * Returns the proper URL for an image.
 * If the image is a Base64 string (starts with "data:image/"), it returns it as is.
 * If it's a file path (starts with "/uploads/"), it prefixes it with the API base URL.
 * Otherwise, it returns an empty string or the original value.
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "";
  
  // If it's already a Data URL (Base64), return it as is
  if (imagePath.startsWith("data:image/")) {
    return imagePath;
  }
  
  // If it's a relative path from the server
  if (imagePath.startsWith("/uploads/")) {
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
    return `${baseUrl}${imagePath}`;
  }
  
  return imagePath;
};

/**
 * Opens a Base64 string in a new tab by converting it to a Blob URL.
 * This avoids the "about:blank" issue in modern browsers.
 */
export const openBase64InNewTab = (base64Data: string) => {
  fetch(base64Data)
    .then((res) => res.blob())  
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) win.focus();
    })
    .catch((error) => {
      console.error("Failed to open Base64 in new tab:", error);
      // Fallback
      const win = window.open(base64Data, "_blank");
      if (win) win.focus();
    });
};
