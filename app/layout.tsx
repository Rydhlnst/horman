import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans, Instrument_Serif, Inter_Tight } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { WalletSessionProvider } from "@/components/wallet/wallet-session";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import "./ui.css";

const body = Instrument_Sans({ variable: "--font-body", subsets: ["latin"] });
const code = IBM_Plex_Mono({ variable: "--font-code", subsets: ["latin"], weight: ["400", "500"] });
// Bricolage is kept for the wordmark only; headlines are Inter Tight with an Instrument Serif italic accent.
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const tight = Inter_Tight({ variable: "--font-tight", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-italic", subsets: ["latin"], weight: "400", style: "italic" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Horman",
    title: "Horman · Ask anything. Keep it private.",
    description: "Chat, create images, run agents and read the chain, all in one private AI workspace.",
  },
  twitter: { card: "summary_large_image", site: "@hormandotdev" },
  title: {
    default: "Horman · Ask anything. Keep it private.",
    template: "%s · Horman",
  },
  description: "Chat, create images, run agents and read the chain, all in one private AI workspace.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${code.variable} ${bricolage.variable} ${tight.variable} ${serif.variable}`}>
      <body className="font-sans text-base leading-relaxed">
        <MotionProvider>
          <WalletSessionProvider>{children}</WalletSessionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
