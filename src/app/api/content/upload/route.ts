import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "site-media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["meals", "desserts", "panels", "uploads"]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function detectImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return "image/gif";
  }
  return null;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase is not configured.", 503);
  }

  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();
    if (claimsError || !claimsData?.claims) {
      return jsonError("Sign in required to upload photos.", 401);
    }

    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "uploads");
    const folder = ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "uploads";

    if (!(file instanceof File)) {
      return jsonError("Choose an image file to upload.", 400);
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return jsonError("Image must be between 1 byte and 5 MB.", 400);
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const detected = detectImageMime(buffer);
    if (!detected || !(detected in MIME_TO_EXT)) {
      return jsonError("Only JPEG, PNG, WebP, or GIF images are allowed.", 400);
    }

    // Prefer detected type over client-provided Content-Type.
    const contentType = detected;
    const ext = MIME_TO_EXT[contentType];
    const path = `${folder}/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return jsonError(uploadError.message, 500);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    if (!data.publicUrl) {
      return jsonError("Upload succeeded but public URL was missing.", 500);
    }

    return NextResponse.json({
      url: data.publicUrl,
      path,
      contentType,
      size: file.size,
    });
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Failed to upload image.";
    return jsonError(message, 500);
  }
}
