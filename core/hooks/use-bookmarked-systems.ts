import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { settings } from "@/core/config";

export interface BookmarkedSystem {
  name: string;
  slug: string;
}

const UPDATE_EVENT = "edcs:bookmarks-updated";

interface BookmarkApiSystem {
  name: string;
  slug: string;
}

interface BookmarksListResponse {
  data: BookmarkApiSystem[];
}

interface BookmarkResponse {
  data: BookmarkApiSystem;
}

function authHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function fetchBookmarks(token: string): Promise<BookmarkedSystem[]> {
  const response = await fetch(`${settings.api.url}/bookmarks?limit=100`, {
    headers: authHeaders(token),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load bookmarks");
  }

  const body: BookmarksListResponse = await response.json();

  return body.data.map(({ name, slug }) => ({ name, slug }));
}

export async function addBookmark(token: string, slug: string): Promise<BookmarkedSystem> {
  const response = await fetch(`${settings.api.url}/bookmarks`, {
    method: "POST",
    headers: authHeaders(token),
    credentials: "include",
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    throw new Error("Failed to add bookmark");
  }

  const body: BookmarkResponse = await response.json();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }

  return { name: body.data.name, slug: body.data.slug };
}

export async function removeBookmark(token: string, slug: string): Promise<void> {
  const response = await fetch(`${settings.api.url}/bookmarks/${slug}`, {
    method: "DELETE",
    headers: authHeaders(token),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to remove bookmark");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

interface Result {
  bookmarks: BookmarkedSystem[];
  isLoading: boolean;
  isBookmarked: (slug: string) => boolean;
  toggle: (system: BookmarkedSystem) => Promise<void>;
}

/**
 * Loads the authenticated user's bookmarks once per session and keeps them in
 * sync across the app via a window-scoped event. Returns no-op behavior when
 * the user is not authenticated.
 */
export function useBookmarkedSystems(): Result {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken ?? null;

  const [bookmarks, setBookmarks] = useState<BookmarkedSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setBookmarks([]);
      return;
    }

    setIsLoading(true);
    try {
      const next = await fetchBookmarks(token);
      setBookmarks(next);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status === "loading") return;

    refresh();

    const onUpdate = () => refresh();
    window.addEventListener(UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(UPDATE_EVENT, onUpdate);
  }, [refresh, status]);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((b) => b.slug === slug),
    [bookmarks],
  );

  const toggle = useCallback(
    async (system: BookmarkedSystem) => {
      if (!token) return;

      const currentlyBookmarked = bookmarks.some((b) => b.slug === system.slug);
      const optimistic = currentlyBookmarked
        ? bookmarks.filter((b) => b.slug !== system.slug)
        : [system, ...bookmarks];

      setBookmarks(optimistic);

      try {
        if (currentlyBookmarked) {
          await removeBookmark(token, system.slug);
        } else {
          await addBookmark(token, system.slug);
        }
      } catch (err) {
        // Roll back on failure
        setBookmarks(bookmarks);
        throw err;
      }
    },
    [bookmarks, token],
  );

  return { bookmarks, isLoading, isBookmarked, toggle };
}
