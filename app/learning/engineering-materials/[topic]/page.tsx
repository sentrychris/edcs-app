import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
import { engineeringTopics, findEngineeringTopic } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return engineeringTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findEngineeringTopic(params.topic);

  return {
    title: topic
      ? `${topic.title} | Engineering & Materials | Learning Resources | ED:CS`
      : "Engineering & Materials | Learning Resources | ED:CS",
    description: topic?.description,
  };
}

export default function EngineeringMaterialsTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findEngineeringTopic(params.topic)}
      moduleHref="/learning/engineering-materials"
      moduleTitle="Engineering & Materials"
      protocolLabel="DATABASE:ENGINEERING-MATERIALS"
      profileTitle="Engineering Profile"
      profileIcon="icarus-terminal-table-index"
    />
  );
}
