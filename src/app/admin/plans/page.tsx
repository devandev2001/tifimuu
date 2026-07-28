"use client";

import { useEffect, useState } from "react";
import {
  AdminSection,
  SaveBar,
  TextAreaField,
  TextField,
} from "@/components/admin/AdminFields";
import { useSiteContent } from "@/components/content/ContentProvider";
import type { PlanTierDraft } from "@/lib/content/types";

export default function AdminPlansPage() {
  const { content, save, saving, ready } = useSiteContent();
  const [draft, setDraft] = useState<PlanTierDraft[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setDraft(structuredClone(content.plans));
  }, [content.plans, content.updatedAt]);

  if (!ready || !draft) return null;

  const patchAt = (index: number, next: PlanTierDraft) => {
    setDraft((current) =>
      current
        ? current.map((entry, i) => (i === index ? next : entry))
        : current,
    );
    setStatus(null);
  };

  const onSave = async () => {
    try {
      await save({ ...content, plans: draft });
      setStatus("Plans saved.");
    } catch {
      setStatus("Save failed. Try again.");
    }
  };

  return (
    <div className="space-y-5">
      <AdminSection
        title="Plan tiers"
        description="Prices and blurbs for Budget, Executive, and Premium. You can add more tiers too."
      >
        {draft.map((tier, index) => (
          <div
            key={`${tier.id}-${index}`}
            className="space-y-3 rounded-xl border border-forest/10 bg-cream/50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-extrabold text-forest">
                {tier.title || `Tier ${index + 1}`}
              </h3>
              {draft.length > 1 ? (
                <button
                  type="button"
                  className="text-sm font-bold text-red-800 underline"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remove the “${tier.title}” plan from the website?`,
                      )
                    ) {
                      setDraft((current) =>
                        current
                          ? current.filter((_, i) => i !== index)
                          : current,
                      );
                    }
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
            <TextField
              id={`tier-id-${index}`}
              label="ID"
              hint="Used internally (example: Executive)"
              value={tier.id}
              onChange={(event) =>
                patchAt(index, { ...tier, id: event.target.value })
              }
            />
            <TextField
              id={`tier-title-${index}`}
              label="Title"
              value={tier.title}
              onChange={(event) =>
                patchAt(index, { ...tier, title: event.target.value })
              }
            />
            <TextField
              id={`tier-price-${index}`}
              label="Price (KWD / week)"
              value={tier.price}
              onChange={(event) =>
                patchAt(index, { ...tier, price: event.target.value })
              }
            />
            <TextAreaField
              id={`tier-blurb-${index}`}
              label="Short description"
              rows={2}
              value={tier.blurb}
              onChange={(event) =>
                patchAt(index, { ...tier, blurb: event.target.value })
              }
            />
            <TextAreaField
              id={`tier-points-${index}`}
              label="Bullet points"
              hint="One point per line"
              rows={4}
              value={tier.points.join("\n")}
              onChange={(event) =>
                patchAt(index, {
                  ...tier,
                  points: event.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                })
              }
            />
            <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-forest">
              <input
                type="checkbox"
                checked={tier.featured}
                onChange={(event) =>
                  patchAt(index, { ...tier, featured: event.target.checked })
                }
              />
              Featured plan
            </label>
          </div>
        ))}

        <button
          type="button"
          className="text-sm font-bold text-forest underline"
          onClick={() =>
            setDraft((current) =>
              current
                ? [
                    ...current,
                    {
                      id: `Plan${current.length + 1}`,
                      title: "New plan",
                      price: "XX",
                      blurb: "Describe this plan.",
                      points: ["Point one", "Point two"],
                      featured: false,
                    },
                  ]
                : current,
            )
          }
        >
          + Add plan
        </button>
      </AdminSection>

      {status ? (
        <p className="text-sm font-semibold text-forest" role="status">
          {status}
        </p>
      ) : null}
      <SaveBar saving={saving} savedAt={content.updatedAt} onSave={() => void onSave()} />
    </div>
  );
}
