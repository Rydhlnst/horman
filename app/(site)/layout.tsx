import { AnnouncementBar } from "@/components/blocks/announcement";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
