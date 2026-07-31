import { NextResponse } from "next/server";
import { createDefaultSiteContent, isSiteContent } from "@/lib/content";
import type { SiteContent } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const ROW_ID = "default";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST() {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase is not configured on the server.", 503);
  }

  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();
    if (claimsError || !claimsData?.claims) {
      return jsonError("Sign in required to reset content.", 401);
    }

    const defaults: SiteContent = createDefaultSiteContent();

    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          id: ROW_ID,
          data: defaults,
          updated_at: defaults.updatedAt,
        },
        { onConflict: "id" },
      )
      .select("data")
      .single();

    if (error) {
      return jsonError(error.message, 500);
    }

    if (!isSiteContent(data?.data)) {
      return jsonError("Reset content had an unexpected shape.", 500);
    }

    return NextResponse.json(data.data);
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Failed to reset content.";
    return jsonError(message, 500);
  }
}
