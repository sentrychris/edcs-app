"use client";

import { type FunctionComponent, memo, useEffect, useRef, useState } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import { getCurrentEliteDate } from "@/core/string-utils";
import Link from "next/link";

interface Props {
  articles: Pick<Galnet, "title" | "slug" | "audio_file" | "uploaded_at">[];
}

const SCROLL_PX_PER_SEC = 80;

const NewsTicker: FunctionComponent<Props> = ({ articles }) => {
  const [currentTime, setCurrentTime] = useState("00:00");

  const trackRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLSpanElement>(null);

  // Clock: update at the top of each minute. Uses refs so the unmount
  // cleanup covers both the setTimeout and any interval it eventually starts.
  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };

    update();

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const msUntilNextMinute = 60000 - (Date.now() % 60000);
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Marquee: single rAF loop, wraps seamlessly using two identical copies of
  // the article list. Skipped entirely when reduced-motion is preferred.
  useEffect(() => {
    const track = trackRef.current;
    const firstCopy = firstCopyRef.current;
    if (!track || !firstCopy) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let copyWidth = firstCopy.offsetWidth;
    let offset = 0;
    let lastTs: number | null = null;
    let rafId: number | null = null;
    let paused = false;

    const step = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (!paused && copyWidth > 0) {
        offset -= SCROLL_PX_PER_SEC * dt;
        if (-offset >= copyWidth) offset += copyWidth;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (rafId != null) return;
      lastTs = null;
      rafId = requestAnimationFrame(step);
    };
    const stop = () => {
      if (rafId == null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const resizeObserver = new ResizeObserver(() => {
      copyWidth = firstCopy.offsetWidth;
      if (copyWidth > 0 && -offset >= copyWidth) offset = 0;
    });
    resizeObserver.observe(firstCopy);

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    track.parentElement?.addEventListener("mouseenter", onEnter);
    track.parentElement?.addEventListener("mouseleave", onLeave);

    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      track.parentElement?.removeEventListener("mouseenter", onEnter);
      track.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, [articles]);

  const currentDate = getCurrentEliteDate();

  const renderArticles = (keyPrefix: string, ariaHidden = false) =>
    articles.map((article, i) => (
      <Link
        key={`${keyPrefix}-${article.slug}-${i}`}
        href={`/galnet/news/${article.slug}`}
        className="me-12 text-xs hover:underline"
        aria-hidden={ariaHidden || undefined}
        tabIndex={ariaHidden ? -1 : undefined}
      >
        {article.uploaded_at} - {article.title}
      </Link>
    ));

  return (
    <div className="relative flex items-center bg-black/50 backdrop-filter backdrop-blur">
      <span className="text-glow__blue border-b border-sky-900/20 ticker-label lg:px-18 z-10 text-xs uppercase">
        <span className="ms-2 hidden sm:flex me-3">
          {currentDate} {currentTime} UTC
        </span>
      </span>
      <div className="ticker flex flex-1 items-center overflow-hidden whitespace-nowrap border-b border-sky-900/20 uppercase">
        <div
          ref={trackRef}
          className="text-glow__blue inline-flex whitespace-nowrap text-xs font-bold tracking-wide will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <span ref={firstCopyRef} className="inline-flex whitespace-nowrap">
            {renderArticles("a")}
          </span>
          <span className="inline-flex whitespace-nowrap" aria-hidden="true">
            {renderArticles("b", true)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(NewsTicker);
