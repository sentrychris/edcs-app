"use client";

import { useBookmarkedSystems } from "@/core/hooks/use-bookmarked-systems";
import SidebarSystemList from "./sidebar-system-list";

const SidebarBookmarkedSystems = () => {
  const { bookmarks } = useBookmarkedSystems();

  return (
    <SidebarSystemList
      storageKey="edcs_sidebar_bookmarks_collapsed"
      icon="icarus-terminal-star"
      label="Bookmarked Systems"
      systems={bookmarks}
      emptyLabel="No bookmarks yet"
      itemIcon="icarus-terminal-star"
    />
  );
};

export default SidebarBookmarkedSystems;
