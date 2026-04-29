"use client";

import { useArticles } from "../lib/articles-context";
import NewsTicker from "./galnet-ticker";

export default function GalnetTickerOverlay() {
  const articles = useArticles();
  return <NewsTicker articles={articles} showClock={false} compact />;
}
