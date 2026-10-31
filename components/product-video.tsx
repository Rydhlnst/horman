"use client";

// A product video that plays muted while it's on screen, after supaste.com's
// feature panels. It always has a pause button, so it can be stopped at any time.

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { VIDEOS, videoById } from "@/lib/videos";

export function ProductVideo({ id, className = "" }: { id: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const meta = videoById(id);

  // Play while at least a third is visible, unless the viewer paused it.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !paused) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.33 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [paused]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      setPaused(false);
      el.play().catch(() => {});
    } else {
      setPaused(true);
      el.pause();
    }
  };

  return (
    <figure className={`product-video ${className}`}>
      <video
        ref={video}
        src={`/videos/${id}.mp4`}
        poster={`/videos/${id}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${meta.title}. ${meta.text}`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="product-video-btn" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <span className="product-video-tag">
        {meta.kind} · {meta.length} · sample data
      </span>
    </figure>
  );
}

/** Every video in one panel, switched with tabs. */
export function VideoTabs() {
  const [id, setId] = useState(VIDEOS[0].id);
  const meta = videoById(id);
  return (
    <div className="folder tone-paper lined video-tabs">
      <span className="folder-tab">Watch it work</span>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SlidingTabs label="Videos" value={id} onChange={setId} items={VIDEOS.map((v) => ({ id: v.id, label: v.tab }))} className="max-w-full overflow-x-auto" />
        <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-muted">{meta.text}</p>
      </div>
      <ProductVideo key={id} id={id} className="mt-5" />
    </div>
  );
}
