import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
import { findXenoTopic, xenoTopics } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return xenoTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findXenoTopic(params.topic);

  return {
    title: topic
      ? `${topic.title} | Thargoids & Guardians | Knowledge Base | ED:CS`
      : "Thargoids & Guardians | Knowledge Base | ED:CS",
    description: topic?.description,
  };
}

export default function ThargoidsGuardiansTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findXenoTopic(params.topic)}
      moduleHref="/knowledge-base/thargoids-guardians"
      moduleTitle="Thargoids & Guardians"
      protocolLabel="DATABASE:XENO-ARCHIVES"
      profileTitle="Xeno Profile"
      profileIcon="icarus-terminal-warning"
    />
  );
}
