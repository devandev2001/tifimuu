"use client";

import { useId, useRef, useState } from "react";
import { FieldLabel } from "@/components/admin/AdminFields";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type ImageUploadFieldProps = {
  id?: string;
  label: string;
  hint?: string;
  value: string;
  folder?: "meals" | "desserts" | "panels" | "uploads";
  onChange: (next: string) => void;
};

/**
 * Admin image control: upload to Supabase Storage, or keep a manual path/URL.
 */
export function ImageUploadField({
  id,
  label,
  hint,
  value,
  folder = "uploads",
  onChange,
}: ImageUploadFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseEnabled = isSupabaseConfigured();

  async function onFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", folder);
      const response = await fetch("/api/content/upload", {
        method: "POST",
        credentials: "include",
        body,
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : `Upload failed (${response.status})`;
        throw new Error(message);
      }
      if (
        !payload ||
        typeof payload !== "object" ||
        !("url" in payload) ||
        typeof (payload as { url: unknown }).url !== "string"
      ) {
        throw new Error("Upload response was missing the image URL.");
      }
      onChange((payload as { url: string }).url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <FieldLabel
        htmlFor={fieldId}
        hint={
          hint ??
          (supabaseEnabled
            ? "Upload a photo, or paste a path/URL."
            : "Supabase is not connected — paste a public path for now.")
        }
      >
        {label}
      </FieldLabel>

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs/paths
        <img
          src={value}
          alt=""
          className="h-28 w-auto max-w-full rounded-xl border border-forest/10 object-cover"
        />
      ) : (
        <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-forest/20 bg-cream/60 text-sm font-semibold text-olive">
          No photo yet
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!supabaseEnabled || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex min-h-11 items-center rounded-full bg-forest px-4 text-sm font-bold text-pistachio disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
        {value ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => onChange("")}
            className="inline-flex min-h-11 items-center rounded-full border border-forest/15 px-4 text-sm font-bold text-olive hover:bg-mint/40"
          >
            Clear
          </button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        id={`${fieldId}-file`}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => void onFileChange(event.target.files)}
      />

      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(event) => {
          setError(null);
          onChange(event.target.value);
        }}
        placeholder="/menu/meals/example.jpg or uploaded URL"
        className="mt-1 w-full rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-forest/40 focus:ring-2 focus:ring-forest/15"
      />

      {error ? (
        <p role="alert" className="text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
