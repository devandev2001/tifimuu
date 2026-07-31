"use client";

import { useEffect, useState } from "react";
import {
  AdminSection,
  SaveBar,
  TextAreaField,
  TextField,
} from "@/components/admin/AdminFields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useSiteContent } from "@/components/content/ContentProvider";
import type { DayMenu } from "@/lib/menu";

export default function AdminMenuPage() {
  const { content, save, saving, ready } = useSiteContent();
  const [draft, setDraft] = useState<DayMenu[] | null>(null);
  const [activeId, setActiveId] = useState<string>("monday");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setDraft(structuredClone(content.menu));
  }, [content.menu, content.updatedAt]);

  if (!ready || !draft) return null;

  const day = draft.find((entry) => entry.id === activeId) ?? draft[0];

  const patch = (next: DayMenu) => {
    setDraft((current) =>
      current
        ? current.map((entry) => (entry.id === next.id ? next : entry))
        : current,
    );
    setStatus(null);
  };

  const onSave = async () => {
    try {
      await save({ ...content, menu: draft });
      setStatus("Menu saved.");
    } catch {
      setStatus("Save failed. Try again.");
    }
  };

  return (
    <div className="space-y-5">
      <AdminSection
        title="Weekly menu"
        description="Edit each day’s meal. Upload photos here, or keep an existing path."
      >
        <div className="flex flex-wrap gap-2">
          {draft.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActiveId(entry.id)}
              className={`rounded-full px-3 py-2 text-sm font-bold ${
                entry.id === day.id
                  ? "bg-forest text-pistachio"
                  : "bg-mint/50 text-forest hover:bg-mint"
              }`}
            >
              {entry.label}
              {entry.isOff ? " (off)" : ""}
            </button>
          ))}
        </div>
      </AdminSection>

      <AdminSection title={`${day.label}`}>
        <TextField
          id="day-label"
          label="Day label"
          value={day.label}
          onChange={(event) => patch({ ...day, label: event.target.value })}
        />
        <TextField
          id="day-short"
          label="Short label"
          value={day.short}
          onChange={(event) => patch({ ...day, short: event.target.value })}
        />
        <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-forest">
          <input
            type="checkbox"
            checked={Boolean(day.isOff)}
            onChange={(event) =>
              patch({ ...day, isOff: event.target.checked })
            }
          />
          Day off (no delivery)
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-forest">
          <input
            type="checkbox"
            checked={Boolean(day.sixDayOnly)}
            onChange={(event) =>
              patch({ ...day, sixDayOnly: event.target.checked })
            }
          />
          Six-day plan only
        </label>
        <ImageUploadField
          id="day-meal-image"
          label="Meal photo"
          folder="meals"
          value={day.mealImage}
          onChange={(next) => patch({ ...day, mealImage: next })}
        />
        <TextAreaField
          id="day-staples"
          label="Staples"
          hint="One dish per line"
          rows={5}
          value={day.staples.join("\n")}
          onChange={(event) =>
            patch({
              ...day,
              staples: event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })
          }
        />
        <TextField
          id="day-veg"
          label="Veg option (optional)"
          value={day.vegOption ?? ""}
          onChange={(event) =>
            patch({
              ...day,
              vegOption: event.target.value.trim() || null,
            })
          }
        />
        <TextField
          id="day-nonveg"
          label="Non-veg option (optional)"
          value={day.nonVegOption ?? ""}
          onChange={(event) =>
            patch({
              ...day,
              nonVegOption: event.target.value.trim() || null,
            })
          }
        />
        <TextField
          id="day-dessert"
          label="Dessert"
          value={day.dessert ?? ""}
          onChange={(event) =>
            patch({
              ...day,
              dessert: event.target.value.trim() || null,
            })
          }
        />
        <ImageUploadField
          id="day-dessert-image"
          label="Dessert photo"
          folder="desserts"
          value={day.dessertImage ?? ""}
          onChange={(next) =>
            patch({
              ...day,
              dessertImage: next.trim() || null,
            })
          }
        />
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
