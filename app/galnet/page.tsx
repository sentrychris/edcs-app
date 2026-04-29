import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import GalnetList from "./components/galnet-list";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import GalnetPowerplay from "./components/galnet-powerplay";
import GalnetLiveFeed from "./components/galnet-live-feed";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getFirstSearchValue = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const parsePositiveInteger = (value: string | string[] | undefined) => {
  const parsed = Number.parseInt(getFirstSearchValue(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const getPageData = async (page?: number) => {
  return await getCollection<Galnet>("galnet/news", page ? { params: { page } } : undefined);
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Galnet News | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/galnet`,
      title: `Galnet News | ${(await parent).title?.absolute}`,
      description: `Latest news from the Galaxy, with Vox Galactica and other independent affiliates.`,
    },
    description: `Latest news from the Galaxy, with Vox Galactica and other independent affiliates.`,
  };
}

export default async function Page({ searchParams }: Props) {
  const page = parsePositiveInteger(searchParams.galnetPage ?? searchParams.page);
  const articles = await getPageData(page);

  return (
    <>
      {/* ── Galnet Terminal status bar ── */}
      <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:GALNET</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">CHANNEL:VOX GALACTICA</span>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-blue h-1.5 w-1.5"></span>
            <span>UPLINK: ACTIVE</span>
          </div>
        </div>
      </Panel>

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-notifications"
        rightLabel="MODULE - GALNET NEWS"
      />

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Article list */}
        <Panel className="xl:col-span-2">
          <Heading bordered icon="icarus-terminal-notifications" title="Galnet Network" subtitle="Vox Galactica Transmissions" className="px-5 py-4">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500">
              <span className="fx-dot-blue h-1.5 w-1.5"></span>
              Live
            </span>
          </Heading>
          <div className="px-5">
            <GalnetList articles={articles} />
          </div>
        </Panel>

        {/* Sidebar */}
        <div className="flex flex-col gap-5 xl:col-span-1">

          {/* Live feed video panel */}
          <GalnetLiveFeed src="/videos/space8.mp4" />

          {/* Powerplay rankings */}
          <Panel variant="muted" className="fx-chamfer">
            <GalnetPowerplay />
          </Panel>

        </div>
      </div>
    </>
  );
}
