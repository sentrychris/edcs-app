import { memo } from "react";
import Link from "next/link";

interface Props {
  backHref: string;
  backLabel: React.ReactNode;
  /** Icon class for the right-side label (e.g. "icarus-terminal-system-orbits"). */
  rightIcon?: string;
  /** Right-side context label, hidden on mobile. */
  rightLabel?: React.ReactNode;
}

const BreadcrumbNav = ({ backHref, backLabel, rightIcon, rightLabel }: Props) => (
  <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
    <Link href={backHref} className="flex items-center gap-2 transition-colors hover:text-sky-400">
      <i className="icarus-terminal-chevron-left text-xs" />
      {backLabel}
    </Link>
    {rightLabel && (
      <span className="hidden items-center gap-2 text-neutral-700 sm:flex">
        {rightIcon && <i className={`${rightIcon} text-sky-500/20`} />}
        {rightLabel}
      </span>
    )}
  </div>
);

export default memo(BreadcrumbNav);
