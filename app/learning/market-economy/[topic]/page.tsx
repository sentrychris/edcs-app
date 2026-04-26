import type { Metadata } from "next";
import FieldGuideTopicPage from "../../components/field-guide-topic-page";
import { findMarketTopic, marketTopics } from "../data";

interface Props {
  params: {
    topic: string;
  };
}

export function generateStaticParams() {
  return marketTopics.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = findMarketTopic(params.topic);

  return {
    title: topic
      ? `${topic.title} | Market & Economy | Learning Resources | ED:CS`
      : "Market & Economy | Learning Resources | ED:CS",
    description: topic?.description,
  };
}

export default function MarketEconomyTopicPage({ params }: Props) {
  return (
    <FieldGuideTopicPage
      topic={findMarketTopic(params.topic)}
      moduleHref="/learning/market-economy"
      moduleTitle="Market & Economy"
      protocolLabel="DATABASE:MARKET-ECONOMY"
      profileTitle="Market Profile"
      profileIcon="icarus-terminal-economy"
    />
  );
}
