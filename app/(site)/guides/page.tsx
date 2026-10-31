import type { Metadata } from "next";
import { PiPlayCircleDuotone } from "react-icons/pi";
import { Head } from "@/components/head";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ProductVideo } from "@/components/product-video";
import { VIDEOS } from "@/lib/videos";

export const metadata: Metadata = { title: "Guides" };

export default function GuidesPage() {
  return (
    <main className="pb-10">
      <section className="wrap pt-16">
        <Head
          page
          Icon={PiPlayCircleDuotone}
          kicker="Guides"
          title={
            <>
              Learn Horman <em>in a few minutes.</em>
            </>
          }
          lede="Short tutorials and how-it-works videos. Each one runs on sample data, so what you see is the flow, not a real account."
        />
      </section>

      <section className="wrap">
        <Stagger className="video-grid" gap={0.06}>
          {VIDEOS.map((v) => (
            <StaggerItem key={v.id} className="video-card">
              <ProductVideo id={v.id} />
              <div className="flex flex-col gap-2 px-2">
                <span className="label">
                  {v.kind} · {v.length}
                </span>
                <h3>{v.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{v.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}
