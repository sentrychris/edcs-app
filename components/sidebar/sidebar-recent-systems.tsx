"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { clearRecentSystems, useRecentSystems } from "@/core/hooks/use-recent-systems";
import SidebarSystemList from "./sidebar-system-list";

const SidebarRecentSystems = () => {
  const systems = useRecentSystems();

  return (
    <SidebarSystemList
      storageKey="edcs_sidebar_recent_collapsed"
      icon="icarus-terminal-system-orbits"
      label="Recently Surveyed"
      systems={systems}
      emptyLabel="No systems surveyed"
      headerAction={
        systems.length > 0 ? (
          <button
            onClick={clearRecentSystems}
            className="ml-auto text-neutral-600 transition-colors hover:text-red-500"
            title="Clear recently surveyed"
            aria-label="Clear recently surveyed"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
    />
  );
};

export default SidebarRecentSystems;
