import { memo } from "react";
import Panel from "./panel";

type Variant = "chamfer" | "panel";
type DotColor = "blue" | "green";

interface Props {
  /** Primary token, e.g. "MODULE:KNOWLEDGE-BASE". */
  moduleLabel: string;
  /** Optional secondary token, e.g. "DATABASE:ORBITAL-MECHANICS" or "PROTOCOL:ROUTE-PLANNER". */
  protocolLabel?: string;
  /** Optional tertiary token. Defaults to "CLASS:UNRESTRICTED". Pass null/empty to omit. */
  classLabel?: string | null;
  /** Right-side status text, e.g. "SIMULATION: ACTIVE". */
  statusLabel: string;
  /** Status indicator dot color. Defaults to "blue". */
  statusDot?: DotColor;
  /** Container style: "chamfer" = raw chamfered div (default), "panel" = bracketed Panel. */
  variant?: Variant;
}

const dotClass: Record<DotColor, string> = {
  blue:  "fx-dot-blue",
  green: "fx-dot-green",
};

const TerminalHeader = ({
  moduleLabel,
  protocolLabel,
  classLabel = "CLASS:UNRESTRICTED",
  statusLabel,
  statusDot = "blue",
  variant = "chamfer",
}: Props) => {
  const inner = (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
      <div className="flex items-center gap-3">
        <span>{moduleLabel}</span>
        {protocolLabel && (
          <>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">{protocolLabel}</span>
          </>
        )}
        {classLabel && (
          <>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">{classLabel}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`${dotClass[statusDot]} h-1.5 w-1.5`} />
        <span>{statusLabel}</span>
      </div>
    </div>
  );

  if (variant === "panel") {
    return <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">{inner}</Panel>;
  }

  return (
    <div className="fx-chamfer relative mb-5 border border-sky-900/40 rounded-xl bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
      {inner}
    </div>
  );
};

export default memo(TerminalHeader);
