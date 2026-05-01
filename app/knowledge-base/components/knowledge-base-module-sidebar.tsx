import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

interface Signal {
  title: string;
  signal: string;
}

interface Props {
  lensIcon: string;
  lensTitle: string;
  paragraphs: string[];
  signals: Signal[];
}

export default function KnowledgeBaseModuleSidebar({
  lensIcon,
  lensTitle,
  paragraphs,
  signals,
}: Props) {
  return (
    <div className="space-y-5">
      <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
        <SectionHeader icon={lensIcon} title={lensTitle} />
        <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Panel>

      <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-table-index" title="Indexed Signals" />
        <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
          {signals.map((signal) => (
            <div key={`${signal.title}_${signal.signal}`} className="flex items-start gap-2">
              <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-sky-500/40" />
              <span>
                <span className="text-neutral-400">{signal.title}</span> - {signal.signal}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
