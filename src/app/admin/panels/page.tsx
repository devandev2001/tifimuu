"use client";

import { useEffect, useState } from "react";
import {
  AdminSection,
  SaveBar,
  TextAreaField,
  TextField,
} from "@/components/admin/AdminFields";
import { useSiteContent } from "@/components/content/ContentProvider";
import type { LandingPanel, LandingPanelId } from "@/lib/landing-panels";

const PANEL_IDS: LandingPanelId[] = [
  "welcome",
  "why",
  "menu",
  "plans",
  "story",
  "order",
  "how",
];

export default function AdminPanelsPage() {
  const { content, save, saving, ready } = useSiteContent();
  const [draft, setDraft] = useState<LandingPanel[] | null>(null);
  const [activeId, setActiveId] = useState<LandingPanelId>("welcome");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setDraft(structuredClone(content.panels));
  }, [content.panels, content.updatedAt]);

  if (!ready || !draft) return null;

  const panel = draft.find((entry) => entry.id === activeId) ?? draft[0];
  const panelIndex = draft.findIndex((entry) => entry.id === panel.id);

  const patch = (next: LandingPanel) => {
    setDraft((current) =>
      current
        ? current.map((entry) => (entry.id === next.id ? next : entry))
        : current,
    );
    setStatus(null);
  };

  const onSave = async () => {
    try {
      await save({ ...content, panels: draft });
      setStatus("Panels saved. Refresh the homepage to see them.");
    } catch {
      setStatus("Save failed. Try again.");
    }
  };

  return (
    <div className="space-y-5">
      <AdminSection
        title="Landing panels"
        description="Each floating homepage slide. Pick a panel, edit it, then save."
      >
        <div className="flex flex-wrap gap-2">
          {draft.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActiveId(entry.id)}
              className={`rounded-full px-3 py-2 text-sm font-bold ${
                entry.id === panel.id
                  ? "bg-forest text-pistachio"
                  : "bg-mint/50 text-forest hover:bg-mint"
              }`}
            >
              {entry.eyebrow || entry.id}
            </button>
          ))}
        </div>
      </AdminSection>

      <AdminSection title={`Edit: ${panel.title || panel.id}`}>
        <TextField
          id="panel-eyebrow"
          label="Eyebrow label"
          value={panel.eyebrow}
          onChange={(event) =>
            patch({ ...panel, eyebrow: event.target.value })
          }
        />
        <TextField
          id="panel-title"
          label="Title"
          value={panel.title}
          onChange={(event) => patch({ ...panel, title: event.target.value })}
        />
        <TextAreaField
          id="panel-body"
          label="Body"
          rows={4}
          value={panel.body}
          onChange={(event) => patch({ ...panel, body: event.target.value })}
        />
        <TextField
          id="panel-image"
          label="Image path"
          hint="Example: /menu/meals/tuesday-pulao.jpg"
          value={panel.image.src}
          onChange={(event) =>
            patch({
              ...panel,
              image: { ...panel.image, src: event.target.value },
            })
          }
        />
        <TextField
          id="panel-image-alt"
          label="Image alt text"
          value={panel.image.alt}
          onChange={(event) =>
            patch({
              ...panel,
              image: { ...panel.image, alt: event.target.value },
            })
          }
        />
        <TextField
          id="panel-caption"
          label="Image caption"
          value={panel.image.caption}
          onChange={(event) =>
            patch({
              ...panel,
              image: { ...panel.image, caption: event.target.value },
            })
          }
        />
        <TextField
          id="panel-cta-label"
          label="Primary button label"
          value={panel.primaryCta.label}
          onChange={(event) =>
            patch({
              ...panel,
              primaryCta: { ...panel.primaryCta, label: event.target.value },
            })
          }
        />
        <TextAreaField
          id="panel-cta-message"
          label="Primary WhatsApp message"
          rows={5}
          value={panel.primaryCta.message}
          onChange={(event) =>
            patch({
              ...panel,
              primaryCta: { ...panel.primaryCta, message: event.target.value },
            })
          }
        />
        <TextField
          id="panel-secondary-label"
          label="Secondary button label (optional)"
          value={panel.secondaryCta?.label ?? ""}
          onChange={(event) => {
            const label = event.target.value;
            if (!label) {
              patch({ ...panel, secondaryCta: undefined });
              return;
            }
            patch({
              ...panel,
              secondaryCta: {
                label,
                targetPanel: panel.secondaryCta?.targetPanel ?? "why",
              },
            });
          }}
        />
        {panel.secondaryCta ? (
          <div>
            <label
              htmlFor="panel-secondary-target"
              className="block text-sm font-bold text-forest"
            >
              Secondary button goes to
            </label>
            <select
              id="panel-secondary-target"
              className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3 py-2.5"
              value={panel.secondaryCta.targetPanel}
              onChange={(event) =>
                patch({
                  ...panel,
                  secondaryCta: {
                    ...panel.secondaryCta!,
                    targetPanel: event.target.value as LandingPanelId,
                  },
                })
              }
            >
              {PANEL_IDS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <TextAreaField
          id="panel-notes"
          label="Notes under the body"
          hint="One note per line"
          rows={4}
          value={(panel.notes ?? []).join("\n")}
          onChange={(event) =>
            patch({
              ...panel,
              notes: event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })
          }
        />
        <TextField
          id="panel-tilt"
          label="Image tilt (degrees)"
          type="number"
          step="0.5"
          value={panel.imageTilt}
          onChange={(event) =>
            patch({
              ...panel,
              imageTilt: Number.parseFloat(event.target.value) || 0,
            })
          }
        />
        <div>
          <label
            htmlFor="panel-glow"
            className="block text-sm font-bold text-forest"
          >
            Glow side
          </label>
          <select
            id="panel-glow"
            className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3 py-2.5"
            value={panel.glow}
            onChange={(event) =>
              patch({
                ...panel,
                glow: event.target.value as "start" | "end",
              })
            }
          >
            <option value="start">Left</option>
            <option value="end">Right</option>
          </select>
        </div>
        <p className="text-xs text-olive">
          Panel {panelIndex + 1} of {draft.length}
        </p>
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
