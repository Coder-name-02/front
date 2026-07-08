import { handleAuthError } from "./apiAuth";

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export async function uploadProductImages(imageFiles, authHeaders, apiUrl) {
  const authRes = await fetch(`${apiUrl}/api/v1/imagekit/auth`, {
    headers: authHeaders,
  });

  if (await handleAuthError(authRes)) {
    throw new Error("Session expired");
  }

  if (!authRes.ok) {
    throw new Error("Failed to get ImageKit auth params.");
  }

  const { signature, token: ikToken, expire } = await authRes.json();
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
//   const uploadedImageUrls = [];

//   for (const file of imageFiles) {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("publicKey", publicKey);
//     formData.append("signature", signature);
//     formData.append("token", ikToken);
//     formData.append("expire", expire);
//     formData.append("fileName", file.name);
//     formData.append("folder", "/myshop/products");

//     const uploadRes = await fetch(IMAGEKIT_UPLOAD_URL, {
//       method: "POST",
//       body: formData,
//     });

//     if (uploadRes.ok) {
//       const data = await uploadRes.json();
//       uploadedImageUrls.push(data.url);
//     } else {
//       const errData = await uploadRes.json().catch(() => ({}));
//       throw new Error(errData.message || "Failed to upload image to ImageKit.");
//     }
//   }

//   return uploadedImageUrls;




const uploadedImageUrls = [];

for (const file of imageFiles) {
  // Get a fresh auth token for this file
  const authRes = await fetch(`${apiUrl}/api/v1/imagekit/auth`, {
    headers: authHeaders,
  });

  if (await handleAuthError(authRes)) {
    throw new Error("Session expired");
  }

  if (!authRes.ok) {
    throw new Error("Failed to get ImageKit auth params.");
  }

  const { signature, token, expire } = await authRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("token", token);
  formData.append("expire", expire);
  formData.append("fileName", file.name);
  formData.append("folder", "/myshop/products");

  const uploadRes = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.message || "Upload failed");
  }

  const data = await uploadRes.json();
  uploadedImageUrls.push({ url: data.url, fileId: data.fileId });
}

return uploadedImageUrls;

}