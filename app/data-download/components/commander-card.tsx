"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { settings } from "@/core/config";

export default function CommanderCard() {
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!session?.user?.accessToken;

  const handleDownload = async () => {
    if (!session?.user?.accessToken) return;

    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(`${settings.api.url}/downloads/commander`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message ?? "Download failed. Try again later.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "commander-profile.json";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative flex flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/30 hover:bg-sky-950/10">
      {/* Corner brackets */}
      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/30" />
      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/30" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/30" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/30" />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <i className="icarus-terminal-ship text-glow__blue text-xl" />
          <div>
            <p className="text-glow__white text-sm font-bold uppercase tracking-wide">
              Commander Profile Snapshot
            </p>
            <p className="mt-0.5 text-[0.7rem] uppercase tracking-widest text-sky-400/60">
              Authenticated session
            </p>
          </div>
        </div>
        <span className="border border-sky-900/30 bg-sky-950/40 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-widest text-sky-400/70">
          .json
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-xs uppercase tracking-wide text-neutral-500">
        A live snapshot of your commander profile pulled directly from the Frontier Companion API.
        Includes ranks, credits, ship loadout, and module inventory. Requires an active Frontier
        session.
      </p>

      {/* Error */}
      {error && (
        <p className="mb-3 flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-red-400/70">
          <i className="icarus-terminal-warning text-[0.7rem]" />
          {error}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        {/* Status */}
        {isAuthenticated ? (
          <span className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-emerald-500/70">
            <span className="h-1 w-1 rounded-full bg-emerald-500/70" />
            Session active
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-neutral-700">
            <span className="h-1 w-1 rounded-full bg-amber-500/40" />
            Login required
          </span>
        )}

        {/* Action */}
        {isAuthenticated ? (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 border border-sky-700/40 px-3 py-1.5 text-[0.7rem] uppercase tracking-widest text-sky-400/80 transition-colors hover:border-sky-500 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i className="icarus-terminal-inventory text-[0.7rem]" />
            {isDownloading ? "Fetching..." : "Download"}
          </button>
        ) : (
          <button
            disabled
            className="flex cursor-not-allowed items-center gap-2 border border-sky-900/20 px-3 py-1.5 text-[0.7rem] uppercase tracking-widest text-neutral-700 opacity-50"
          >
            <i className="icarus-terminal-inventory text-[0.7rem]" />
            Download
          </button>
        )}
      </div>
    </div>
  );
}
