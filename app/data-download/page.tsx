import type { Metadata } from "next";
import Panel from "@/components/panel";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import DownloadGrid from "./components/download-grid";
import CommanderCard from "./components/commander-card";

export const metadata: Metadata = {
  title: "Data Downloads | ED:CS",
  description:
    "Bulk exports of the ED:CS dataset — systems, bodies, stations, fleet carriers, and commander profiles.",
};

export default function DataDownloadPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:DATA"
        protocolLabel="DATABASE:EXPORT"
        statusLabel="ENDPOINT: ONLINE"
      />

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-inventory"
        rightLabel="MODULE — DATA DOWNLOADS"
      />

      {/* Hero */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Data Downloads
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Bulk Exports &amp; Dataset Archives
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
            <span>Datasets updated nightly</span>
          </div>
        </div>
      </Panel>

      {/* Download sections */}
      <DownloadGrid />

      {/* Commander — live CAPI snapshot */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <div className="mb-4 flex items-center gap-3 border-b border-sky-900/20 pb-4">
          <i className="icarus-terminal-ship text-glow__blue text-lg" />
          <p className="text-glow__white text-sm font-bold uppercase tracking-widest">Commander</p>
        </div>
        <CommanderCard />
      </Panel>
    </>
  );
}
