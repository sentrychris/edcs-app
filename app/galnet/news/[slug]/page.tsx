import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { settings } from "@/core/config";
import { getCollection, getResource } from "@/core/api";
import dynamic from "next/dynamic";
import GalnetSidebar from "../../components/galnet-sidebar";
import GalnetLiveFeed from "../../components/galnet-live-feed";
import Panel from "@/components/panel";
import BreadcrumbNav from "@/components/breadcrumb-nav";

const GalnetArticle = dynamic(() => import("../../components/galnet-article"), {
  ssr: false,
});

interface Props {
  params: {
    slug: string;
  };
  searchParams?: {
    galnetPage?: string | string[];
    galnetSlice?: string | string[];
  };
}

const getFirstSearchValue = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const parseIndex = (value: string | string[] | undefined) => {
  const parsed = Number.parseInt(getFirstSearchValue(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const parsePage = (value: string | string[] | undefined) => {
  const parsed = Number.parseInt(getFirstSearchValue(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const getPageData = async ({ params }: Props) => {
  const articles = await getCollection<Galnet>("galnet/news", {
    params: {
      limit: 100,
    },
  });

  const { data: article } = await getResource<Galnet>(`galnet/news/${params.slug}`);

  return {
    articles,
    article,
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const galnet = await getPageData({ params });

  return {
    title: `${galnet.article.title} - ${galnet.article.uploaded_at} | GalNet News`,
    openGraph: {
      ...(await parent).openGraph,
      images: [
        {
          url: `${settings.app.url + galnet.article.banner_image}`,
        },
      ],
      url: `${settings.app.url}/galnet/news/${params.slug}`,
      title: `${galnet.article.title} - ${galnet.article.uploaded_at} | Galnet News`,
      description: `${galnet.article.uploaded_at} - ${galnet.article.title}`,
    },
    description: `${galnet.article.uploaded_at} - ${galnet.article.title}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const galnet = await getPageData({ params });
  const galnetPage = parsePage(searchParams?.galnetPage);
  const galnetSlice = parseIndex(searchParams?.galnetSlice);
  const backHref = galnetPage ? `/galnet?galnetPage=${galnetPage}` : "/galnet";

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
        backHref={backHref}
        backLabel="Galnet News"
        rightIcon="icarus-terminal-notifications"
        rightLabel="ARTICLE - GALNET TRANSMISSION"
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* ── Article ── */}
        <div className="xl:col-span-2">
          <GalnetArticle article={galnet.article} />
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-5 xl:col-span-1">

          {/* Live feed video panel */}
          <GalnetLiveFeed src="/videos/space4.mp4" />

          {/* Article index */}
          <GalnetSidebar
            articles={galnet.articles}
            currentArticleSlug={galnet.article.slug}
            initialSlice={galnetSlice}
            returnPage={galnetPage}
          />

        </div>
      </div>
    </>
  );
}
