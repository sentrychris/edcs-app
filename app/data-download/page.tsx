import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Data Download | ED:CS",
  description: "Bulk exports of the ED:CS dataset — systems, bodies, stations, fleet carriers, and commander profiles.",
};

interface DownloadItem {
  icon:        string;
  title:       string;
  description: string;
  format:      string;
  scope:       string;
  note?:       string;
}

const SECTIONS: { heading: string; icon: string; items: DownloadItem[] }[] = [
  {
    heading: "Stellar Catalogue",
    icon:    "icarus-terminal-system-orbits",
    items: [
      {
        icon:        "icarus-terminal-system-orbits",
        title:       "Full Systems Dump",
        description: "Every star system in the database. Includes system name, coordinates, allegiance, government, economy, security, and metadata.",
        format:      ".json.gz",
        scope:       "All systems",
        note:        "Large file",
      },
      {
        icon:        "icarus-terminal-system-bodies",
        title:       "Populated Systems",
        description: "Systems with a recorded population greater than zero. Smaller than the full dump — useful for economy and BGS research.",
        format:      ".json.gz",
        scope:       "Population > 0",
        note:        "Large file",
      },
      {
        icon:        "icarus-terminal-scan",
        title:       "Systems — Last 7 Days",
        description: "Systems whose records were created or updated within the past seven days. Useful for incremental sync against a local mirror.",
        format:      ".json.gz",
        scope:       "Updated ≤ 7 days",
      },
    ],
  },
  {
    heading: "Stellar Bodies",
    icon:    "icarus-terminal-planet",
    items: [
      {
        icon:        "icarus-terminal-planet",
        title:       "All Bodies",
        description: "Every catalogued body across all systems — stars, planets, moons, and asteroid belts — with orbital parameters, composition, and surface data.",
        format:      ".json.gz",
        scope:       "All bodies",
        note:        "Large file",
      },
      {
        icon:        "icarus-terminal-scan",
        title:       "Bodies — Last 7 Days",
        description: "Bodies added or updated within the past seven days. Suitable for incremental updates to a locally cached body catalogue.",
        format:      ".json.gz",
        scope:       "Updated ≤ 7 days",
      },
    ],
  },
  {
    heading: "Infrastructure",
    icon:    "icarus-terminal-station",
    items: [
      {
        icon:        "icarus-terminal-coriolis-starport",
        title:       "All Stations",
        description: "Starports, outposts, planetary ports, fleet carrier stops, and odyssey settlements. Includes economy, services, landing pads, and market data.",
        format:      ".json.gz",
        scope:       "All stations",
        note:        "Large file",
      },
      {
        icon:        "icarus-terminal-scan",
        title:       "Stations — Last 7 Days",
        description: "Station records created or updated in the past seven days. Tracks market refreshes, service changes, and new settlement discoveries.",
        format:      ".json.gz",
        scope:       "Updated ≤ 7 days",
      },
      {
        icon:        "icarus-terminal-megaship",
        title:       "All Fleet Carriers",
        description: "Active fleet carrier records including callsign, owner, current system, docking access, active services, and last seen timestamp.",
        format:      ".json.gz",
        scope:       "All fleet carriers",
      },
      {
        icon:        "icarus-terminal-scan",
        title:       "Fleet Carriers — Last 7 Days",
        description: "Fleet carriers whose jump position, services, or access permissions changed in the past seven days.",
        format:      ".json.gz",
        scope:       "Updated ≤ 7 days",
      },
    ],
  },
  {
    heading: "Commander",
    icon:    "icarus-terminal-ship",
    items: [
      {
        icon:        "icarus-terminal-ship",
        title:       "Commander Profile Snapshot",
        description: "A live snapshot of your own commander profile pulled directly from the Frontier Companion API. Includes ranks, credits, ship loadout, and module inventory. Requires an active session.",
        format:      ".json",
        scope:       "Authenticated session",
      },
    ],
  },
];

function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <div className="relative flex flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/30 hover:bg-sky-950/10">
      {/* Corner brackets */}
      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/30" />
      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/30" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/30" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/30" />

      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <i className={`${item.icon} text-glow__blue text-xl`} />
          <div>
            <p className="text-glow__white text-sm font-bold uppercase tracking-wide">
              {item.title}
            </p>
            <p className="mt-0.5 text-[0.6rem] uppercase tracking-widest text-sky-400/60">
              {item.scope}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="border border-sky-900/30 bg-sky-950/40 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-sky-400/70">
            {item.format}
          </span>
          {item.note && (
            <span className="text-[0.6rem] uppercase tracking-widest text-amber-500/60">
              {item.note}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-xs uppercase tracking-wide text-neutral-500">
        {item.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-widest text-neutral-700">
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          Endpoint pending
        </span>
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-2 border border-sky-900/20 px-3 py-1.5 text-[0.6rem] uppercase tracking-widest text-neutral-700 opacity-50"
          title="Download endpoint not yet available"
        >
          <i className="icarus-terminal-inventory text-[0.6rem]" />
          Download
        </button>
      </div>
    </div>
  );
}

export default function DataDownloadPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:DATA"
        protocolLabel="DATABASE:EXPORT"
        statusLabel="ENDPOINT: PENDING"
      />

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-inventory"
        rightLabel="MODULE — DATA DOWNLOAD"
      />

      {/* Hero */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Data Download
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Bulk Exports &amp; Dataset Archives
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
            <span>Download endpoints in development</span>
          </div>
        </div>
      </Panel>

      {/* Status notice */}
      <Panel variant="muted" className="fx-chamfer mb-5 px-4 py-3">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-warning mt-0.5 text-sm text-amber-500/70" />
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Download endpoints are not yet wired to the backend. The datasets listed here reflect
            the planned export scope. Buttons will activate once the generation and streaming
            pipeline is deployed. All exports are served as compressed archives where noted.
          </p>
        </div>
      </Panel>

      {/* Download sections */}
      <div className="space-y-5">
        {SECTIONS.map((section) => (
          <Panel key={section.heading} variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon={section.icon} title={section.heading} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <DownloadCard key={item.title} item={item} />
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
