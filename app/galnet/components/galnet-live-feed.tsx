import Panel from "@/components/panel";
import GalnetTickerOverlay from "./galnet-ticker-overlay";

interface Props {
  src: string;
}

export default function GalnetLiveFeed({ src }: Props) {
  return (
    <Panel variant="muted" className="fx-chamfer overflow-hidden">
      <div className="relative">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover p-1"
        />
        <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/50 px-2 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-red-400">Live</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <GalnetTickerOverlay />
        </div>
      </div>
      <div className="p-4">
        <p className="text-glow__white font-bold uppercase tracking-widest">Vox Galactica</p>
        <p className="mt-0.5 text-xs uppercase tracking-widest text-sky-400/50">Galactic Broadcast Network</p>
        <p className="mt-3 text-[0.7rem] uppercase leading-relaxed tracking-wide text-neutral-600">
          Broadcasting live across all inhabited systems. Correspondents embedded throughout the
          core worlds, Colonia, and beyond — delivering unfiltered reports as events unfold.
        </p>
      </div>
    </Panel>
  );
}
