"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface SystemListItem {
  name: string;
  slug: string;
}

interface Props {
  storageKey: string;
  icon: string;
  label: string;
  systems: SystemListItem[];
  emptyLabel: string;
  headerAction?: ReactNode;
  defaultCollapsed?: boolean;
  itemIcon?: string;
}

const SidebarSystemList = ({
  storageKey,
  icon,
  label,
  systems,
  emptyLabel,
  headerAction,
  defaultCollapsed = false,
  itemIcon = "icarus-terminal-location",
}: Props) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, [storageKey]);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(storageKey, String(!prev));
      return !prev;
    });
  };

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-2 border-b border-sky-900/20 pb-3 text-xs uppercase tracking-widest text-neutral-600">
        <button
          onClick={toggle}
          className="flex flex-1 items-center gap-2 text-left text-xs uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-300"
          aria-expanded={!collapsed}
          aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-3 w-3 shrink-0" />
          ) : (
            <ChevronDownIcon className="h-3 w-3 shrink-0" />
          )}
          <i className={`${icon} text-sky-500/50`}></i>
          <span>{label}</span>
        </button>
        {!collapsed && headerAction}
      </div>

      {!collapsed && (
        systems.length === 0 ? (
          <p className="px-1 text-xs uppercase tracking-widest text-neutral-800">
            {emptyLabel}
          </p>
        ) : (
          <div className="flex flex-col">
            {systems.map(({ name, slug }) => (
              <Link
                key={slug}
                prefetch={false}
                href={`/systems/${slug}`}
                className="group flex items-center gap-2.5 border-l-2 border-transparent py-2 pl-3 pr-2 text-xs uppercase tracking-widest text-neutral-500 transition-all hover:border-sky-900/40 hover:bg-sky-900/5 hover:text-neutral-200"
              >
                <i className={`${itemIcon} text-neutral-800 transition-colors group-hover:text-neutral-600 text-sm`}></i>
                <span className="truncate">{name}</span>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SidebarSystemList;
