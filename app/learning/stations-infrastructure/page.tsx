import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { infrastructureTopics } from "./data";

export const metadata: Metadata = {
  title: "Stations, Settlements & Infrastructure | Learning Resources | ED:CS",
  description: "Field guides for station types, economies, services, planetary ports, fleet carriers, and Odyssey settlements.",
};

export default function StationsInfrastructurePage() {
  return (
    <FieldGuideModulePage
      topics={infrastructureTopics}
      protocolLabel="DATABASE:INFRASTRUCTURE"
      moduleTitle="Stations, Settlements & Infrastructure"
      moduleSubtitle="Ports, Services & Surface Facilities"
      moduleIcon="icarus-terminal-system-orbits"
      contextLabel="MODULE - INFRASTRUCTURE"
      lensTitle="Infrastructure Lens"
      lensParagraphs={[
        "This module treats stations and settlements as practical infrastructure: docking access, services, economies, security, and travel cost all shape commander decisions.",
        "It connects directly to ED:CS station and system data because every service flag or pad limitation can become a search filter, route constraint, or planning warning.",
      ]}
    />
  );
}
