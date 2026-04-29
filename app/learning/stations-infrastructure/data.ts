import type { FieldGuideTopic } from "../lib/field-guide-types";

export const infrastructureTopics: FieldGuideTopic[] = [
  {
    slug: "station-types",
    href: "/learning/stations-infrastructure/station-types",
    icon: "icarus-terminal-system-orbits",
    title: "Station Types",
    subtitle: "Coriolis, Orbis, Ocellus, Outposts & Asteroid Bases",
    description: "How major station silhouettes differ and what each structure implies for docking, services, traffic, and system identity.",
    tags: ["Stations", "Docking", "Infrastructure"],
    status: "available",
    signal: "STRUCTURE: STATION",
    overview: [
      "Station type is more than visual flavour. Large rotating starports, compact outposts, asteroid bases, and surface ports all change docking access, traffic flow, service expectations, and how a system feels to use.",
    ],
    keyPoints: [
      { label: "Large ports", detail: "Coriolis, Orbis, and Ocellus stations usually support broad services and heavy traffic." },
      { label: "Outposts", detail: "Small orbital facilities lack large pads, which matters for trade ships and mission planning." },
      { label: "Asteroid bases", detail: "Embedded facilities often mark mining, frontier, or unusual regional infrastructure." },
    ],
    fieldNotes: [
      "Always check pad size before sending a large ship to an outpost.",
      "Station type can be a fast clue about system maturity, traffic volume, and likely service coverage.",
    ],
    reference: [
      { label: "Large pad", value: "Major starport", note: "Usually available at full-size orbital stations." },
      { label: "Small profile", value: "Outpost", note: "Useful but limited, especially for large vessels." },
    ],
  },
  {
    slug: "economy-types",
    href: "/learning/stations-infrastructure/economy-types",
    icon: "icarus-terminal-economy",
    title: "Economy Types",
    subtitle: "Extraction, Refinery, High Tech, Tourism & Military",
    description: "How station economies shape services, commodity behaviour, mission flavour, and trade-route expectations.",
    tags: ["Economy", "Trade", "Services"],
    status: "available",
    signal: "ECONOMY: LOCAL",
    overview: [
      "An economy label is a compact description of what a station produces, consumes, and cares about. It helps commanders predict commodity flows and the kinds of services or missions likely to appear.",
    ],
    keyPoints: [
      { label: "Production", detail: "Extraction, agriculture, and refinery economies feed raw or processed goods into the market." },
      { label: "Demand", detail: "High tech, military, tourism, and industrial economies often consume very different goods." },
      { label: "Pairing", detail: "Trade routes work best when one economy's surplus lines up with another economy's demand." },
    ],
    fieldNotes: [
      "Economy type is a first-pass filter; live market data still decides whether a trade is profitable.",
      "Multiple-economy stations can have broader behaviour than a single label suggests.",
    ],
    reference: [
      { label: "Supply clue", value: "Economy type", note: "Hints at what a station may export." },
      { label: "Demand clue", value: "Population role", note: "Hints at what a station may import." },
    ],
  },
  {
    slug: "station-services",
    href: "/learning/stations-infrastructure/station-services",
    icon: "icarus-terminal-table-index",
    title: "Services",
    subtitle: "Outfitting, Shipyard, Black Market, Vista & Factors",
    description: "A practical guide to the services commanders look for when planning trade, repair, crime cleanup, biology turn-ins, or ship changes.",
    tags: ["Services", "Outfitting", "Vista"],
    status: "available",
    signal: "SERVICES: AVAILABLE",
    overview: [
      "Services define what a station can do for a commander. Two ports in the same system may feel completely different if one has a shipyard, Vista Genomics, Interstellar Factors, or a black market and the other does not.",
    ],
    keyPoints: [
      { label: "Ship services", detail: "Outfitting, shipyard, repair, restock, and refuel decide whether the port can support builds." },
      { label: "Special services", detail: "Vista Genomics, Interstellar Factors, and black markets support specific loops." },
      { label: "Search value", detail: "Service filters turn station data into direct route and planning decisions." },
    ],
    fieldNotes: [
      "Explorers need Vista Genomics or Universal Cartographics more than a perfect commodity market.",
      "A crime cleanup stop is only useful if Interstellar Factors are actually available and accessible.",
    ],
    reference: [
      { label: "Biology turn-in", value: "Vista Genomics", note: "Needed for exobiology data sales." },
      { label: "Bounty cleanup", value: "Interstellar Factors", note: "Useful after fines, bounties, or hostile activity." },
    ],
  },
  {
    slug: "planetary-ports-vs-orbital-stations",
    href: "/learning/stations-infrastructure/planetary-ports-vs-orbital-stations",
    icon: "icarus-terminal-planet",
    title: "Planetary Ports vs Orbital Stations",
    subtitle: "Approach Time, Gravity & Surface Access",
    description: "How surface ports differ from orbital facilities in travel time, landing risk, service access, and mission context.",
    tags: ["Planetary", "Orbital", "Landing"],
    status: "available",
    signal: "PORT: SURFACE",
    overview: [
      "Orbital stations are usually faster to reach from supercruise. Planetary ports trade that convenience for surface context, settlement proximity, and operations that happen on or near a body.",
    ],
    keyPoints: [
      { label: "Approach cost", detail: "Planetary landings add glide, descent, gravity, and terrain considerations." },
      { label: "Surface context", detail: "Surface ports connect naturally to Odyssey missions, settlements, and local body conditions." },
      { label: "Operational choice", detail: "The best port is often the one with the right services at the lowest travel cost." },
    ],
    fieldNotes: [
      "A cheap commodity price can be less attractive if the port sits deep in a gravity well.",
      "Surface access matters more for commanders combining station work with settlement or exobiology loops.",
    ],
    reference: [
      { label: "Fast stop", value: "Orbital station", note: "Usually lower approach overhead." },
      { label: "Surface loop", value: "Planetary port", note: "Better tied to settlement and body activity." },
    ],
  },
  {
    slug: "fleet-carriers",
    href: "/learning/stations-infrastructure/fleet-carriers",
    icon: "icarus-terminal-route",
    title: "Fleet Carriers",
    subtitle: "Mobile Infrastructure, Markets & Services",
    description: "How carriers act as mobile bases, trade platforms, expedition support, and temporary infrastructure in remote regions.",
    tags: ["Carriers", "Markets", "Mobile Base"],
    status: "available",
    signal: "INFRA: MOBILE",
    overview: [
      "Fleet carriers are player-directed infrastructure. They can move services, storage, markets, repair, and social logistics into places that may otherwise have no station support at all.",
    ],
    keyPoints: [
      { label: "Mobility", detail: "Carriers can reposition infrastructure across systems and deep-space routes." },
      { label: "Markets", detail: "Carrier owners can set stock, demand, tariffs, and trading opportunities." },
      { label: "Support role", detail: "Expeditions use carriers as repair, refuel, redemption, and staging platforms." },
    ],
    fieldNotes: [
      "Carrier availability can change quickly, so live data is more important than static assumptions.",
      "A carrier is not always public infrastructure; docking and service access can be restricted.",
    ],
    reference: [
      { label: "Jump asset", value: "Carrier", note: "Moves infrastructure over long distances." },
      { label: "Trade surface", value: "Carrier market", note: "Player-managed stock and demand." },
    ],
  },
  {
    slug: "settlement-layouts",
    href: "/learning/stations-infrastructure/settlement-layouts",
    icon: "icarus-terminal-shield",
    title: "Settlement Layouts",
    subtitle: "Odyssey Facilities, Roles & Security Levels",
    description: "How settlement type, security, power state, and building layout affect Odyssey missions and surface operations.",
    tags: ["Settlements", "Security", "Odyssey"],
    status: "available",
    signal: "SURFACE: SETTLEMENT",
    overview: [
      "Settlements are functional layouts with alarms, restricted zones, power systems, data ports, guards, and mission objectives. Their economy and security level define how risky they feel on foot.",
    ],
    keyPoints: [
      { label: "Layout", detail: "Building placement shapes patrol routes, sight lines, access panels, and objective paths." },
      { label: "Security", detail: "Higher security increases consequences for scans, trespass, theft, and alarms." },
      { label: "Power state", detail: "Online, offline, damaged, or abandoned states change mission flow and hazard level." },
    ],
    fieldNotes: [
      "A settlement is easiest to read as a set of zones: public, restricted, powered, watched, and objective-critical.",
      "Settlement type can be as important as faction state when judging mission difficulty.",
    ],
    reference: [
      { label: "Risk marker", value: "Security level", note: "Higher values mean less forgiveness." },
      { label: "Mission flow", value: "Power state", note: "Determines doors, alarms, hazards, and restoration needs." },
    ],
  },
];

export function findInfrastructureTopic(slug: string): FieldGuideTopic | undefined {
  return infrastructureTopics.find((topic) => topic.slug === slug);
}
