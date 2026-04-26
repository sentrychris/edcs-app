import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import { cartographyTopics, findCartographyTopic } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return cartographyTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findCartographyTopic(params.topic);

  if (!topic) {
    return {
      title: "Galactic Cartography | Learning Resources | ED:CS",
    };
  }

  return {
    title: `${topic.title} | Galactic Cartography | Learning Resources | ED:CS`,
    description: topic.description,
  };
}

export default function GalacticCartographyTopicPage({ params }: Props) {
  const topic = findCartographyTopic(params.topic);

  if (!topic) {
    notFound();
  }

  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:GALACTIC-CARTOGRAPHY"
        statusLabel={topic.signal}
      />

      <BreadcrumbNav
        backHref="/learning/galactic-cartography"
        backLabel="Galactic Cartography"
        rightIcon={topic.icon}
        rightLabel={`TOPIC - ${topic.title.toUpperCase()}`}
      />

      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className={`${topic.icon} text-glow__blue mt-0.5 text-2xl`} />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              {topic.title}
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              {topic.subtitle}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-route" title="Cartographic Overlay" className="mb-0 border-0 pb-0" />
            </div>

            <div className="relative min-h-[420px] flex-1 overflow-hidden p-5">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute left-1/2 top-0 h-full w-px bg-sky-900/30" />
                <div className="absolute left-0 top-1/2 h-px w-full bg-sky-900/30" />
                <div className="absolute inset-8 border border-sky-900/20" />
                <div className="absolute inset-16 border border-sky-900/10" />
              </div>

              <div className="relative grid h-full grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex min-h-[220px] items-center justify-center">
                  <div className="relative h-56 w-56">
                    <div className="absolute inset-0 rounded-full border border-sky-500/15" />
                    <div className="absolute inset-8 rounded-full border border-sky-500/20" />
                    <div className="absolute inset-16 rounded-full border border-sky-500/30" />
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-sky-400/70 shadow-[0_0_18px_rgba(56,189,248,0.7)]" />
                    {topic.keyPoints.map((point, index) => {
                      const positions = [
                        "left-[8%] top-[24%]",
                        "right-[7%] top-[18%]",
                        "bottom-[18%] left-[16%]",
                        "bottom-[13%] right-[14%]",
                      ];

                      return (
                        <div
                          key={point.label}
                          className={`absolute h-2 w-2 border border-sky-400/50 bg-black ${positions[index % positions.length]}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-700">
                    Signal Summary
                  </p>
                  {topic.overview.map((paragraph) => (
                    <p key={paragraph} className="text-xs uppercase tracking-wide text-neutral-500">
                      {paragraph}
                    </p>
                  ))}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-sky-900/30 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="flex h-full flex-col gap-5 lg:self-stretch">
          <Panel variant="muted" className="fx-chamfer flex flex-1 basis-0 flex-col p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Key Concepts" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {topic.keyPoints.map((point) => (
                <div key={point.label} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-sky-500/40" />
                  <span>
                    <span className="text-neutral-400">{point.label}</span> - {point.detail}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer flex flex-1 basis-0 flex-col p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Field Notes" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              {topic.fieldNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-table-index" title="Reference" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Signal</th>
                <th className="pb-2 pr-4">Value</th>
                <th className="pb-2">Use</th>
              </tr>
            </thead>
            <tbody>
              {topic.reference.map((row) => (
                <tr key={row.label} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold text-sky-400/70">{row.label}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.value}</td>
                  <td className="py-2 text-neutral-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
