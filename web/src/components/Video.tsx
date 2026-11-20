"use client";

import { useState } from "react";

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

/** Tap to load the demo inline. Nothing loads from YouTube until it's opened. */
export function DemoButton({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  const id = youtubeId(url);
  const isShort = url.includes("/shorts/");
  if (!id) {
    return (
      <a className="demo-link" href={url} target="_blank" rel="noopener">
        Watch demo
      </a>
    );
  }
  return (
    <>
      <button type="button" className="demo-link" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Hide demo" : "Watch demo"}
      </button>
      {open && (
        <div className={`video ${isShort ? "short" : ""}`}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`}
            title={`${name} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </>
  );
}

/** Inline player that shows the YouTube thumbnail first and loads the video on tap. */
export function VideoEmbed({ url, name }: { url: string; name: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  const isShort = url.includes("/shorts/");
  if (!id) {
    return (
      <a className="demo-link" href={url} target="_blank" rel="noopener">
        Watch demo
      </a>
    );
  }
  return (
    <div className={`video ${isShort ? "short" : ""}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
          title={`${name} demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-thumb" onClick={() => setPlaying(true)} aria-label={`Play ${name} demo`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="video-play" aria-hidden>▶</span>
        </button>
      )}
    </div>
  );
}
