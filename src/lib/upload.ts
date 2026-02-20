import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mode = process.env.NEXT_PUBLIC_UPLOAD_MODE || "local";

  if (mode === "cloudinary") {
    const { uploadToCloudinary } = await import("./cloudinary");
    return uploadToCloudinary(buffer);
  }

  // Local filesystem upload for dev
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}
