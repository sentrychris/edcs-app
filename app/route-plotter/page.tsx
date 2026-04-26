import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import { auth } from "@/core/auth";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import RoutePlotterView from "./components/route-plotter-view";

interface Props {
  searchParams: { from?: string; to?: string; ly?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Route Plotter | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/route-plotter`,
      title: `Route Plotter | ${(await parent).title?.absolute}`,
      description: "Plan jump routes between star systems in Elite: Dangerous.",
    },
    description: "Plan jump routes between star systems in Elite: Dangerous.",
  };
}

export default async function Page({ searchParams }: Props) {
  const initialLy = searchParams.ly ? parseInt(searchParams.ly, 10) : 30;

  // Pre-fill the FROM (origin) field from the commander's last known system.
  // Only when ?from= isn't supplied — URL takes precedence. Destination is
  // never pre-filled.
  const session            = await auth();
  const lastSystem         = session?.user?.commander?.last_system ?? null;
  const initialFromSystem  = !searchParams.from && lastSystem ? lastSystem : null;
  const initialFrom        = searchParams.from ?? lastSystem?.slug ?? "";

  return (
    <>
      {/* ── Navigation header bar ── */}
      <TerminalHeader
        variant="panel"
        moduleLabel="MODULE:NAVIGATION"
        protocolLabel="PROTOCOL:ROUTE-PLANNER"
        statusLabel="NAVIGATION: ACTIVE"
      />

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-route"
        rightLabel="MODULE - ROUTE PLOTTER"
      />

      <RoutePlotterView
        initialFrom={initialFrom}
        initialFromSystem={initialFromSystem}
        initialTo={searchParams.to ?? ""}
        initialLy={Number.isNaN(initialLy) ? 30 : initialLy}
      />
    </>
  );
}
