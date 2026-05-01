import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { xenoTopics } from "./data";

export const metadata: Metadata = {
  title: "Thargoids & Guardians | Knowledge Base | ED:CS",
  description: "Field guides for Thargoids, Guardians, AX combat, xeno war sites, artefacts, ruins, and human-xeno history.",
};

export default function ThargoidsGuardiansPage() {
  return (
    <FieldGuideModulePage
      topics={xenoTopics}
      protocolLabel="DATABASE:XENO-ARCHIVES"
      moduleTitle="Thargoids & Guardians"
      moduleSubtitle="Xeno Biology, Ancient Sites & War Context"
      moduleIcon="icarus-terminal-warning"
      contextLabel="MODULE - THARGOIDS & GUARDIANS"
      lensTitle="Xeno Lens"
      lensParagraphs={[
        "This module treats xeno knowledge as both lore and survival context: Guardian sites, Thargoid contacts, AX combat rules, and war geography all affect how commanders move through the galaxy.",
        "It fits ED:CS because xeno sites, Galnet events, permit regions, and system states turn narrative history into route constraints and practical warnings.",
      ]}
    />
  );
}
