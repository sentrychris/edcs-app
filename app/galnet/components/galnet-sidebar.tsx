"use client";

import { useEffect, useMemo, useState, type FunctionComponent } from "react";
import type { Pagination } from "@/core/interfaces/Pagination";
import type { Galnet } from "@/core/interfaces/Galnet";
import Link from "next/link";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import { cn } from "@/core/cn";

interface Props {
  className?: string;
  articles: Pagination<Galnet>;
  currentArticleSlug?: string;
  initialSlice?: number;
  returnPage?: number;
}

const ITEMS_PER_SLICE = 5;

function clampSlice(slice: number, totalSlices: number) {
  return Math.min(Math.max(slice, 0), Math.max(totalSlices - 1, 0));
}

const GalnetSidebar: FunctionComponent<Props> = ({
  className,
  articles,
  currentArticleSlug,
  initialSlice,
  returnPage,
}) => {
  const totalSlices = Math.max(1, Math.ceil(articles.data.length / ITEMS_PER_SLICE));
  const resolvedInitialSlice = useMemo(() => {
    if (typeof initialSlice === "number" && Number.isFinite(initialSlice)) {
      return clampSlice(initialSlice, totalSlices);
    }

    if (currentArticleSlug) {
      const articleIndex = articles.data.findIndex((article) => article.slug === currentArticleSlug);
      if (articleIndex >= 0) {
        return clampSlice(Math.floor(articleIndex / ITEMS_PER_SLICE), totalSlices);
      }
    }

    return 0;
  }, [articles.data, currentArticleSlug, initialSlice, totalSlices]);

  const [currentSlice, setCurrentSlice] = useState(resolvedInitialSlice);

  useEffect(() => {
    setCurrentSlice(resolvedInitialSlice);
  }, [resolvedInitialSlice]);

  const handleNextSlice = () => {
    if ((currentSlice + 1) * ITEMS_PER_SLICE < articles.data.length) {
      setCurrentSlice((prev) => prev + 1);
    }
  };

  const handlePrevSlice = () => {
    if (currentSlice > 0) {
      setCurrentSlice((prev) => prev - 1);
    }
  };

  const startIndex = currentSlice * ITEMS_PER_SLICE;
  const slicedArticles = articles.data.slice(startIndex, startIndex + ITEMS_PER_SLICE);
  const articleHref = (slug: string) => {
    const params = new URLSearchParams({ galnetSlice: String(currentSlice) });

    if (typeof returnPage === "number" && Number.isFinite(returnPage)) {
      params.set("galnetPage", String(returnPage));
    }

    return `/galnet/news/${slug}?${params.toString()}`;
  };

  return (
    <Panel variant="muted" className={cn("", className)} cornerClassName="z-10">

      <div className="p-4">
        {/* Section header */}
        <Heading bordered icon="icarus-terminal-notifications" title="Galnet Comms" subtitle="Uplink Channel" className="mb-4 pb-4">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500">
            <span className="fx-dot-blue h-1.5 w-1.5"></span>
            Live
          </span>
        </Heading>

      {slicedArticles.map((article, i) => (
        <div key={article.id} className="group relative border-b border-sky-900/20 py-4">
          {/* Transmission index */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-neutral-600">
              TRANSMISSION {String(startIndex + i + 1).padStart(3, "0")}
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-600">
              {article.uploaded_at}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-sm uppercase leading-snug tracking-wide text-neutral-400 group-hover:text-neutral-300">
            {article.title}
          </h3>

          {/* Read more */}
          <Link
            href={articleHref(article.slug)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-glow__blue font-bold transition-colors hover:text-sky-300"
          >
            Access Report <span>{">>"}</span>
          </Link>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 text-xs uppercase tracking-widest">
        <button
          onClick={handlePrevSlice}
          disabled={currentSlice === 0}
          className="flex items-center gap-2 text-glow__blue uppercase transition-colors hover:text-glow__blue disabled:cursor-not-allowed disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-neutral-600">
          {currentSlice + 1} / {totalSlices}
        </span>
        <button
          onClick={handleNextSlice}
          disabled={(currentSlice + 1) * ITEMS_PER_SLICE >= articles.data.length}
          className="flex items-center gap-2 text-glow__blue uppercase transition-colors hover:text-glow__blue disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>
      </div>
    </Panel>
  );
};

export default GalnetSidebar;
