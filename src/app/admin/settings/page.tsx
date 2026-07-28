"use client";

import { useEffect, useState } from "react";
import {
  AdminSection,
  SaveBar,
  TextAreaField,
  TextField,
} from "@/components/admin/AdminFields";
import { useSiteContent } from "@/components/content/ContentProvider";
import type { SiteSettings } from "@/lib/content";

export default function AdminSettingsPage() {
  const { content, save, saving, ready } = useSiteContent();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setDraft(structuredClone(content.settings));
  }, [content.settings, content.updatedAt]);

  if (!ready || !draft) return null;

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setStatus(null);
  };

  const onSave = async () => {
    try {
      await save({
        ...content,
        settings: draft,
      });
      setStatus("Settings saved. Open the website to see updates.");
    } catch {
      setStatus("Save failed. Try again.");
    }
  };

  return (
    <div className="space-y-5">
      <AdminSection
        title="Brand"
        description="Name and tagline shown on the site and splash."
      >
        <TextField
          id="site-name"
          label="Business name"
          value={draft.site.name}
          onChange={(event) =>
            update("site", { ...draft.site, name: event.target.value })
          }
        />
        <TextField
          id="site-tagline"
          label="Tagline"
          value={draft.site.tagline}
          onChange={(event) =>
            update("site", { ...draft.site, tagline: event.target.value })
          }
        />
        <TextField
          id="site-region"
          label="Region"
          value={draft.site.region}
          onChange={(event) =>
            update("site", { ...draft.site, region: event.target.value })
          }
        />
      </AdminSection>

      <AdminSection
        title="WhatsApp"
        description="Every Order button uses this number and starter message."
      >
        <TextField
          id="wa-url"
          label="WhatsApp link"
          hint='Example: https://wa.me/96551282020'
          value={draft.whatsappUrl}
          onChange={(event) => update("whatsappUrl", event.target.value)}
        />
        <TextAreaField
          id="wa-message"
          label="Default order message"
          rows={8}
          value={draft.generalInquiryMessage}
          onChange={(event) =>
            update("generalInquiryMessage", event.target.value)
          }
        />
      </AdminSection>

      <AdminSection title="Contact & delivery">
        <TextField
          id="kitchen"
          label="Kitchen area"
          value={draft.kitchenArea}
          onChange={(event) => update("kitchenArea", event.target.value)}
        />
        <TextAreaField
          id="areas"
          label="Delivery areas"
          hint="One area per line"
          rows={4}
          value={draft.deliveryAreas.join("\n")}
          onChange={(event) =>
            update(
              "deliveryAreas",
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
        />
        <TextField
          id="phone"
          label="Phone"
          value={draft.contact.phone}
          onChange={(event) =>
            update("contact", { ...draft.contact, phone: event.target.value })
          }
        />
        <TextField
          id="email"
          label="Email"
          value={draft.contact.email}
          onChange={(event) =>
            update("contact", { ...draft.contact, email: event.target.value })
          }
        />
        <TextField
          id="ig-handle"
          label="Instagram handle"
          value={draft.contact.instagramHandle}
          onChange={(event) =>
            update("contact", {
              ...draft.contact,
              instagramHandle: event.target.value,
            })
          }
        />
        <TextField
          id="ig-url"
          label="Instagram URL"
          value={draft.contact.instagramUrl}
          onChange={(event) =>
            update("contact", {
              ...draft.contact,
              instagramUrl: event.target.value,
            })
          }
        />
      </AdminSection>

      <AdminSection
        title="Our story"
        description="Paragraphs used on the story / about content."
      >
        <TextAreaField
          id="story"
          label="Story paragraphs"
          hint="Separate paragraphs with a blank line"
          rows={12}
          value={draft.storyParagraphs.join("\n\n")}
          onChange={(event) =>
            update(
              "storyParagraphs",
              event.target.value
                .split(/\n\s*\n/)
                .map((part) => part.trim())
                .filter(Boolean),
            )
          }
        />
      </AdminSection>

      <AdminSection title="Why Tiffimu">
        <TextField
          id="why-eyebrow"
          label="Eyebrow"
          value={draft.why.eyebrow}
          onChange={(event) =>
            update("why", { ...draft.why, eyebrow: event.target.value })
          }
        />
        <TextField
          id="why-title"
          label="Title"
          value={draft.why.title}
          onChange={(event) =>
            update("why", { ...draft.why, title: event.target.value })
          }
        />
        {draft.why.reasons.map((reason, index) => (
          <div
            key={`reason-${index}`}
            className="space-y-3 rounded-xl border border-forest/10 bg-cream/60 p-4"
          >
            <TextField
              id={`reason-title-${index}`}
              label={`Reason ${index + 1} title`}
              value={reason.title}
              onChange={(event) => {
                const reasons = draft.why.reasons.map((entry, i) =>
                  i === index ? { ...entry, title: event.target.value } : entry,
                );
                update("why", { ...draft.why, reasons });
              }}
            />
            <TextAreaField
              id={`reason-body-${index}`}
              label="Body"
              rows={3}
              value={reason.body}
              onChange={(event) => {
                const reasons = draft.why.reasons.map((entry, i) =>
                  i === index ? { ...entry, body: event.target.value } : entry,
                );
                update("why", { ...draft.why, reasons });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm font-bold text-forest underline"
          onClick={() =>
            update("why", {
              ...draft.why,
              reasons: [
                ...draft.why.reasons,
                { title: "New reason", body: "Describe this reason." },
              ],
            })
          }
        >
          + Add reason
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
