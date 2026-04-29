"use client";

import type { FunctionComponent } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { useBookmarkedSystems } from "@/core/hooks/use-bookmarked-systems";

interface Props {
  name: string;
  slug: string;
}

const SystemBookmarkToggle: FunctionComponent<Props> = ({ name, slug }) => {
  const { status } = useSession();
  const { isBookmarked, toggle } = useBookmarkedSystems();
  const [isPending, setIsPending] = useState(false);

  if (status !== "authenticated") return null;

  const bookmarked = isBookmarked(slug);

  const onClick = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await toggle({ name, slug });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={`group flex h-8 w-8 shrink-0 items-center justify-center rounded transition-colors disabled:opacity-50 ${
        bookmarked
          ? "text-yellow-400 hover:text-yellow-300"
          : "text-neutral-700 hover:text-yellow-400"
      }`}
      title={bookmarked ? "Remove bookmark" : "Bookmark this system"}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this system"}
      aria-pressed={bookmarked}
    >
      {bookmarked ? (
        <StarIconSolid className="h-5 w-5" />
      ) : (
        <StarIconOutline className="h-5 w-5" />
      )}
    </button>
  );
};

export default SystemBookmarkToggle;
