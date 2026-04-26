import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import { auth } from "@/core/auth";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import DistanceSearchView from "./components/distance-search-view";

interface Props {
  searchParams: { slug?: string; ly?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Distance Search | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/distance-search`,
      title: `Distance Search | ${(await parent).title?.absolute}`,
      description: "Find star systems within a given distance of any system in Elite: Dangerous.",
    },
    description: "Find star systems within a given distance of any system in Elite: Dangerous.",
  };
}

export default async function Page({ searchParams }: Props) {
  const initialLy = searchParams.ly ? parseInt(searchParams.ly, 10) : 50;

  // Pre-fill origin from the commander's last known system, but only when the
  // URL hasn't supplied its own slug (URL takes precedence).
  const session       = await auth();
  const lastSystem    = session?.user?.commander?.last_system ?? null;
  const initialSystem = !searchParams.slug && lastSystem ? lastSystem : null;
  const initialSlug   = searchParams.slug ?? lastSystem?.slug ?? "";

  return (
    <>
      {/* ── Navigation header bar ── */}
      <TerminalHeader
        variant="panel"
        moduleLabel="MODULE:SCANNER"
        protocolLabel="PROTOCOL:PROXIMITY-SCAN"
        statusLabel="SCANNER: ACTIVE"
      />

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-scan"
        rightLabel="MODULE - DISTANCE SEARCH"
      />

      <DistanceSearchView
        initialSlug={initialSlug}
        initialSystem={initialSystem}
        initialLy={Number.isNaN(initialLy) ? 50 : initialLy}
      />
    </>
  );
}
