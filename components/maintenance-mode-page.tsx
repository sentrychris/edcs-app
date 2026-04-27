import Panel from "@/components/panel";
import TerminalHeader from "@/components/terminal-header";

export default function MaintenanceModePage() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center p-4 text-neutral-200 text-glow__white">
      <div className="w-full max-w-4xl">
        <TerminalHeader
          moduleLabel="MODULE:SYSTEM"
          protocolLabel="PROTOCOL:MAINTENANCE"
          classLabel="CLASS:RESTRICTED"
          statusLabel="SERVICE: OFFLINE"
        />

        <Panel className="fx-chamfer fx-panel-scan px-5 py-6 md:px-8 md:py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex h-24 w-24 items-center justify-center border border-sky-900/30 bg-black/30 md:h-32 md:w-32">
              <i className="icarus-terminal-warning text-red-400/70 text-4xl md:text-5xl" />
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-400/60">
                ED:CS Network Advisory
              </p>
              <h1 className="text-glow__white mb-3 text-2xl font-bold uppercase tracking-wide md:text-5xl">
                Down For Maintenance
              </h1>
              <p className="max-w-2xl text-sm uppercase leading-relaxed tracking-wide text-neutral-500">
                Core services are temporarily offline while systems are being calibrated.
                Please check back shortly.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-sky-900/20 pt-5 text-xs uppercase tracking-widest text-neutral-600 md:grid-cols-3">
            <div className="border border-sky-900/20 bg-black/20 p-3">
              <span className="mb-1 block text-neutral-700">Access</span>
              <span className="text-red-400/70">Suspended</span>
            </div>
            <div className="border border-sky-900/20 bg-black/20 p-3">
              <span className="mb-1 block text-neutral-700">Navigation</span>
              <span className="text-red-400/70">Locked</span>
            </div>
            <div className="border border-sky-900/20 bg-black/20 p-3">
              <span className="mb-1 block text-neutral-700">Data Feeds</span>
              <span className="text-orange-400/70">Standby</span>
            </div>
          </div>
        </Panel>
      </div>
    </main>
  );
}
