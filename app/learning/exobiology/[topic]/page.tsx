import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
import { exobiologyTopics, findExobiologyTopic } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return exobiologyTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findExobiologyTopic(params.topic);

  return {
    title: topic
      ? `${topic.title} | Exobiology | Learning Resources | ED:CS`
      : "Exobiology | Learning Resources | ED:CS",
    description: topic?.description,
  };
}

export default function ExobiologyTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findExobiologyTopic(params.topic)}
      moduleHref="/learning/exobiology"
      moduleTitle="Exobiology"
      protocolLabel="DATABASE:EXOBIOLOGY"
      profileTitle="Bio-Survey Profile"
      profileIcon="icarus-terminal-planet-atmosphere"
    />
  );
}
