import { NextResponse } from "next/server";
import { createDefaultSiteContent, isSiteContent } from "@/lib/content";
import type { SiteContent } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const ROW_ID = "default";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    return { supabase, user: null as null };
  }
  return { supabase, user: data.claims };
}

function asContent(value: unknown): SiteContent | null {
  return isSiteContent(value) ? value : null;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase is not configured on the server.", 503);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      return jsonError(error.message, 500);
    }

    const content = asContent(data?.data);
    if (!content) {
      return NextResponse.json(createDefaultSiteContent());
    }
    return NextResponse.json(content);
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Failed to load content.";
    return jsonError(message, 500);
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase is not configured on the server.", 503);
  }

  try {
    const { supabase, user } = await requireUser();
    if (!user) {
      return jsonError("Sign in required to save content.", 401);
    }

    const body: unknown = await request.json();
    if (!isSiteContent(body)) {
      return jsonError("Invalid site content payload.", 400);
    }

    const next: SiteContent = {
      ...body,
      version: 1,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          id: ROW_ID,
          data: next,
          updated_at: next.updatedAt,
        },
        { onConflict: "id" },
      )
      .select("data")
      .single();

    if (error) {
      return jsonError(error.message, 500);
    }

    const saved = asContent(data?.data);
    if (!saved) {
      return jsonError("Saved content had an unexpected shape.", 500);
    }
    return NextResponse.json(saved);
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Failed to save content.";
    return jsonError(message, 500);
  }
}
