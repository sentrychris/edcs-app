import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
import { findInfrastructureTopic, infrastructureTopics } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return infrastructureTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findInfrastructureTopic(params.topic);

  return {
    title: topic
      ? `${topic.title} | Stations, Settlements & Infrastructure | Learning Resources | ED:CS`
      : "Stations, Settlements & Infrastructure | Learning Resources | ED:CS",
    description: topic?.description,
  };
}

export default function StationsInfrastructureTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findInfrastructureTopic(params.topic)}
      moduleHref="/learning/stations-infrastructure"
      moduleTitle="Stations, Settlements & Infrastructure"
      protocolLabel="DATABASE:INFRASTRUCTURE"
      profileTitle="Infrastructure Profile"
      profileIcon="icarus-terminal-system-orbits"
    />
  );
}
