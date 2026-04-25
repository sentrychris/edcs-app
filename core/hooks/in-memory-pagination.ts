import { useState } from "react";
import type { Links, Meta } from "@/core/interfaces/Pagination";

interface Result<T> {
  rows: T[];
  meta: Meta;
  links: Links;
  currentPage: number;
  setPage: (link: string) => void;
}

/**
 * Slices an in-memory list into a single page and produces meta/links
 * matching the shape used by server-paginated collections, so the same
 * Table/PaginationLinks components can render either source.
 */
export function useInMemoryPagination<T>(list: T[], perPage = 10): Result<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const total = list.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const from = (currentPage - 1) * perPage;
  const to = Math.min(from + perPage, total);

  const meta: Meta = { current_page: currentPage, from: from + 1, path: "", per_page: perPage, to };
  const links: Links = {
    first: `?page=1`,
    last: `?page=${lastPage}`,
    prev: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    next: currentPage < lastPage ? `?page=${currentPage + 1}` : null,
  };

  const setPage = (link: string) => {
    const params = new URLSearchParams(link.replace(/^[^?]*/, ""));
    setCurrentPage(parseInt(params.get("page") ?? "1", 10));
  };

  return { rows: list.slice(from, to), meta, links, currentPage, setPage };
}
