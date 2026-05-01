import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import EngineerDirectory from "./components/engineer-directory";
import { engineers } from "./data";

export const metadata: Metadata = {
  title: "Engineers | ED:CS",
  description: "Roster of ship and pilot equipment engineers across the Core Systems, Colonia Region, and Witch Head Nebula.",
};

export default function EngineeringPage() {
  const shipCount  = engineers.filter((e) => e.discipline === "ship").length;
  const pilotCount = engineers.filter((e) => e.discipline === "pilot").length;

  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:ENGINEERING"
        protocolLabel="DATABASE:ENGINEER-REGISTRY"
        statusLabel="REGISTRY: SYNCED"
      />

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-engineering"
        rightLabel="MODULE - ENGINEER REGISTRY"
      />

      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Engineers
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Ship Modules &amp; Pilot Equipment Specialists
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="fx-dot-blue h-1.5 w-1.5" />
              <span>{shipCount} Ship</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="fx-dot-green h-1.5 w-1.5" />
              <span>{pilotCount} Pilot</span>
            </div>
            <div className="hidden md:block text-neutral-700">|</div>
            <span className="hidden md:inline">{engineers.length} Records</span>
          </div>
        </div>
      </Panel>

      <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Registered Engineers" />
        <EngineerDirectory engineers={engineers} />
      </Panel>
    </>
  );
}
