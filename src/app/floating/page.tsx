import { redirect } from "next/navigation";

/** Legacy route — homepage is the continuous scroll experience. */
export default function FloatingPreviewPage() {
  redirect("/");
}
