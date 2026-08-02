import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { ContentProvider } from "@/components/content/ContentProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiffimu — Tiffin Made For You",
  description:
    "Fresh, home-style Indian comfort meals delivered across Kuwait. Pick a 5-day or 6-day tiffin plan and order in one WhatsApp message.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icon.png" }],
  },
  openGraph: {
    title: "Tiffimu — Tiffin Made For You",
    description:
      "Fresh, home-style Indian comfort meals delivered across Kuwait.",
    images: ["/characters/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ccea94",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", baloo.variable, nunito.variable)}
    >
      <body>
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
