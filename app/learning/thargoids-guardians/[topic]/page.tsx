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
      ? `${topic.title} | Thargoids & Guardians | Learning Resources | ED:CS`
      : "Thargoids & Guardians | Learning Resources | ED:CS",
    description: topic?.description,
  };
}

export default function ThargoidsGuardiansTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findXenoTopic(params.topic)}
      moduleHref="/learning/thargoids-guardians"
      moduleTitle="Thargoids & Guardians"
      protocolLabel="DATABASE:XENO-ARCHIVES"
      profileTitle="Xeno Profile"
      profileIcon="icarus-terminal-warning"
    />
  );
}
