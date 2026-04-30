import type { DumpManifestEntry, DumpType } from "@/core/interfaces/DownloadManifest";
import { settings } from "@/core/config";

interface Props {
  icon: string;
  title: string;
  description: string;
  format: string;
  scope: string;
  note?: string;
  type: DumpType;
  entry: DumpManifestEntry | undefined;
  isLoadingManifest: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function formatBuiltAt(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DownloadCard({
  icon,
  title,
  description,
  format,
  scope,
  note,
  type,
  entry,
  isLoadingManifest,
}: Props) {
  const available = entry?.available ?? false;
  const downloadUrl = `${settings.api.url}/downloads/${type}`;

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
          <i className={`${icon} text-glow__blue text-xl`} />
          <div>
            <p className="text-glow__white text-sm font-bold uppercase tracking-wide">{title}</p>
            <p className="mt-0.5 text-[0.7rem] uppercase tracking-widest text-sky-400/60">{scope}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="border border-sky-900/30 bg-sky-950/40 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-widest text-sky-400/70">
            {format}
          </span>
          {note && (
            <span className="text-[0.7rem] uppercase tracking-widest text-amber-500/60">{note}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-xs uppercase tracking-wide text-neutral-500">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        {/* Status / metadata */}
        {isLoadingManifest ? (
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-700">
            <span className="h-1 w-1 animate-pulse rounded-full bg-neutral-700" />
            Checking...
          </span>
        ) : available && entry ? (
          <span className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-500/70">
              <span className="h-1 w-1 rounded-full bg-emerald-500/70" />
              {entry.size !== null ? formatBytes(entry.size) : "Available"}
            </span>
            {entry.built_at && (
              <span className="text-xs uppercase tracking-widest text-neutral-600">
                Built {formatBuiltAt(entry.built_at)}
              </span>
            )}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-700">
            <span className="h-1 w-1 rounded-full bg-amber-500/40" />
            Not yet generated
          </span>
        )}

        {/* Download action */}
        {available ? (
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-2 border border-sky-700/40 px-3 py-1.5 text-[0.7rem] uppercase tracking-widest text-sky-400/80 transition-colors hover:border-sky-500 hover:text-sky-300"
          >
            <i className="icarus-terminal-inventory text-[0.7rem]" />
            Download
          </a>
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
