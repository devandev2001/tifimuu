import { redirect } from "next/navigation";

/** Legacy preview — main homepage is the floating panel experience. */
export default function FloatingPreviewPage() {
  redirect("/");
}
