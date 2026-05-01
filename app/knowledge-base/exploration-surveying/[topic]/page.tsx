import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
import { explorationTopics, findExplorationTopic } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return explorationTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findExplorationTopic(params.topic);

  return {
    title: topic
      ? `${topic.title} | Exploration & Surveying | Knowledge Base | ED:CS`
      : "Exploration & Surveying | Knowledge Base | ED:CS",
    description: topic?.description,
  };
}

export default function ExplorationSurveyingTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findExplorationTopic(params.topic)}
      moduleHref="/knowledge-base/exploration-surveying"
      moduleTitle="Exploration & Surveying"
      protocolLabel="DATABASE:EXPLORATION-SURVEYING"
      profileTitle="Survey Profile"
      profileIcon="icarus-terminal-scan"
    />
  );
}
