import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
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

  return {
    title: topic
      ? `${topic.title} | Galactic Cartography | Learning Resources | ED:CS`
      : "Galactic Cartography | Learning Resources | ED:CS",
    description: topic?.description,
  };
}

export default function GalacticCartographyTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findCartographyTopic(params.topic)}
      moduleHref="/learning/galactic-cartography"
      moduleTitle="Galactic Cartography"
      protocolLabel="DATABASE:GALACTIC-CARTOGRAPHY"
      profileTitle="Cartographic Overlay"
      profileIcon="icarus-terminal-route"
    />
  );
}
