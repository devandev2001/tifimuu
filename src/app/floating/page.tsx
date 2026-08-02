import { redirect } from "next/navigation";

/** Legacy preview route — homepage now uses the continuous scroll layout. */
export default function FloatingPreviewPage() {
  redirect("/");
}
