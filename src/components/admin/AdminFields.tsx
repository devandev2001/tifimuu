import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-base text-ink outline-none transition-[border-color,box-shadow] focus:border-forest/40 focus:ring-2 focus:ring-forest/15";

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-forest">
      {children}
      {hint ? (
        <span className="mt-0.5 block text-xs font-medium text-olive/80">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextField({
  id,
  label,
  hint,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <input id={id} className={fieldClass} {...props} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  rows = 4,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
  rows?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <textarea id={id} rows={rows} className={fieldClass} {...props} />
    </div>
  );
}

export function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-xl font-extrabold text-forest">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed text-olive">{description}</p>
      ) : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function SaveBar({
  saving,
  savedAt,
  onSave,
  disabled,
}: {
  saving: boolean;
  savedAt?: string | null;
  onSave: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest/15 bg-pistachio/95 px-4 py-3 shadow-lg backdrop-blur-sm">
      <p className="text-sm font-semibold text-forest/80">
        {saving
          ? "Saving…"
          : savedAt
            ? `Last saved ${new Date(savedAt).toLocaleString()}`
            : "Unsaved changes stay on this device until you save."}
      </p>
      <button
        type="button"
        onClick={onSave}
        disabled={disabled || saving}
        className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 font-display text-base font-bold text-pistachio disabled:opacity-50"
      >
        Save changes
      </button>
    </div>
  );
}
