import { memo } from "react";
import Link from "next/link";
import SponsorBanner from "./sponsor-banner";

interface Props {
  backHref: string;
  backLabel: React.ReactNode;
  /** Icon class for the right-side label (e.g. "icarus-terminal-system-orbits"). */
  rightIcon?: string;
  /** Right-side context label, hidden on mobile. */
  rightLabel?: React.ReactNode;
}

const BreadcrumbNav = ({ backHref, backLabel, rightIcon, rightLabel }: Props) => (
  <div className="mb-5 flex items-center justify-between gap-3">

    {/* ── Back button — terminal-style with corner brackets & light sweep ── */}
    <Link
      href={backHref}
      className="fx-btn-sweep group relative flex items-center gap-2.5 border border-sky-900/40 bg-black/30 px-3.5 py-2 text-xs uppercase tracking-widest text-neutral-400 backdrop-blur backdrop-filter transition-colors hover:border-sky-700/60 hover:bg-sky-950/20 hover:text-sky-200"
    >
      {/* Corner brackets — match topic-card aesthetic */}
      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-400/80" />
      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-400/80" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-400/80" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-400/80" />

      {/* Animated chevron — slides left on hover */}
      <i className="icarus-terminal-chevron-left text-[0.65rem] text-sky-400/70 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-sky-300" />

      {/* "RETURN ::" — labelled action prefix */}
      <span className="text-sky-500/55 group-hover:text-sky-300/90">RETURN</span>
      <span className="text-neutral-700 group-hover:text-sky-700/70">::</span>
      <span className="text-neutral-300 group-hover:text-sky-100">{backLabel}</span>

      {/* Trailing pulse dot — subtle "active" indicator */}
      <span className="ml-1 h-1 w-1 bg-sky-500/50 transition-colors group-hover:bg-sky-400" />
    </Link>

    {/* ── Rotating sponsor banner — desktop only, fills the gap ── */}
    <SponsorBanner />

    {/* ── Context chip — current location indicator ── */}
    {rightLabel && (
      <span className="relative hidden items-center gap-2 border border-sky-900/30 bg-black/20 px-3 py-1.5 text-[0.65rem] uppercase tracking-widest text-neutral-500 backdrop-blur backdrop-filter sm:flex">
        {/* Smaller corner brackets to differentiate from button */}
        <span className="pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-sky-500/30" />
        <span className="pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-sky-500/30" />
        <span className="pointer-events-none absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-sky-500/30" />
        <span className="pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-sky-500/30" />

        <span className="fx-dot-blue h-1 w-1" />
        {rightIcon && <i className={`${rightIcon} text-sky-500/40`} />}
        {rightLabel}
      </span>
    )}
  </div>
);

export default memo(BreadcrumbNav);
