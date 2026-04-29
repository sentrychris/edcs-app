"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";

type Article = Pick<Galnet, "title" | "slug" | "audio_file" | "uploaded_at">;

const ArticlesContext = createContext<Article[]>([]);

export function ArticlesProvider({ articles, children }: { articles: Article[]; children: ReactNode }) {
  return <ArticlesContext.Provider value={articles}>{children}</ArticlesContext.Provider>;
}

export function useArticles() {
  return useContext(ArticlesContext);
}
