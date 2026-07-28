import { FloatingSite } from "@/components/floating-site/FloatingSite";
import { FloatingSiteProvider } from "@/components/floating-site/FloatingSiteProvider";
import { Header } from "@/components/Header";
import { SiteChrome } from "@/components/SiteChrome";

export default function Home() {
  return (
    <SiteChrome>
      <a
        href="#main"
        className="sr-only rounded-md bg-forest px-4 py-2 text-pistachio focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <FloatingSiteProvider>
        <div data-enter="header">
          <Header />
        </div>
        <main id="main">
          <FloatingSite />
        </main>
      </FloatingSiteProvider>
    </SiteChrome>
  );
}
