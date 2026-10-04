import { Footer } from "@/components/marketing/Sections";
import { Nav } from "@/components/marketing/Nav";
import { ProgressRail } from "@/components/marketing/ProgressRail";
import { SceneBackdrop } from "@/components/marketing/scene/SceneBackdrop";
import { SmoothScroll } from "@/components/marketing/SmoothScroll";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark relative min-h-screen bg-[#05060a] text-foreground">
      <noscript>
        <style>{`[style*="opacity: 0"]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
      </noscript>
      <SmoothScroll />
      <SceneBackdrop />
      <Nav />
      <main className="relative z-10">{children}</main>
      <Footer />
      <ProgressRail />
    </div>
  );
}
