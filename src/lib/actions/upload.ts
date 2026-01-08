"use server";

import { put } from "@vercel/blob";

export async function uploadPhoto(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "Nenhum arquivo fornecido" };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "Arquivo deve ter no máximo 5MB" };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Tipo de arquivo não permitido. Use JPG, PNG ou WebP",
      };
    }

    const timestamp = Date.now();
    const filename = timestamp + "-" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    const blob = await put("maintenance/" + filename, file, {
      access: "public",
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return { success: false, error: "Erro ao fazer upload da foto" };
  }
}
