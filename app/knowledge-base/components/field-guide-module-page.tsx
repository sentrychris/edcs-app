import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import KnowledgeBaseModuleSidebar from "./knowledge-base-module-sidebar";
import type { FieldGuideTopic } from "../lib/field-guide-types";

interface Props {
  topics: FieldGuideTopic[];
  protocolLabel: string;
  moduleTitle: string;
  moduleSubtitle: string;
  moduleIcon: string;
  contextLabel: string;
  lensTitle: string;
  lensParagraphs: string[];
}

export default function FieldGuideModulePage({
  topics,
  protocolLabel,
  moduleTitle,
  moduleSubtitle,
  moduleIcon,
  contextLabel,
  lensTitle,
  lensParagraphs,
}: Props) {
  const sidebarSignals = topics.map((topic) => ({
    title: topic.title,
    signal: topic.signal,
  }));

  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:KNOWLEDGE-BASE"
        protocolLabel={protocolLabel}
        statusLabel={`${topics.length} field guide${topics.length !== 1 ? "s" : ""} indexed`}
      />

      <BreadcrumbNav
        backHref="/knowledge-base"
        backLabel="Knowledge Base"
        rightIcon={moduleIcon}
        rightLabel={contextLabel}
      />

      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className={`${moduleIcon} text-glow__blue mt-0.5 text-2xl`} />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              {moduleTitle}
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              {moduleSubtitle}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel variant="muted" className="fx-chamfer p-4 md:p-5 lg:col-span-2">
          <SectionHeader icon="icarus-terminal-scan" title="Field Guides" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {topics.map((topic) => (
              <Link key={topic.href} href={topic.href} className="group flex h-full flex-col">
                <div className="relative flex h-full flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                  <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <i className={`${topic.icon} text-glow__blue text-xl`} />
                    <span className="text-[0.7rem] uppercase tracking-widest text-green-500/70">
                      Available
                    </span>
                  </div>

                  <p className="text-glow__white mb-0.5 text-sm font-bold uppercase tracking-wide">
                    {topic.title}
                  </p>
                  <p className="mb-3 text-[0.65rem] uppercase tracking-widest text-sky-400/60">
                    {topic.subtitle}
                  </p>

                  <p className="mb-3 flex-1 text-xs uppercase tracking-wide text-neutral-500">
                    {topic.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-sky-900/30 px-2 py-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <KnowledgeBaseModuleSidebar
          lensIcon="icarus-terminal-info"
          lensTitle={lensTitle}
          paragraphs={lensParagraphs}
          signals={sidebarSignals}
        />
      </div>
    </>
  );
}
