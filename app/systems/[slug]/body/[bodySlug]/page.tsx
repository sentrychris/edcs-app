import type { Metadata, ResolvingMetadata } from "next";
import type { SystemBodyResource, SystemBodyRing } from "@/core/interfaces/SystemBody";
import type { Station } from "@/core/interfaces/Station";
import { settings } from "@/core/config";
import { getResource } from "@/core/api";
import { formatDate, formatNumber, formatOrbitalPeriod } from "@/core/string-utils";
import { PLANETARY_BASES, SystemBodyType } from "@/core/constants/system";
import { stationIconByType } from "@/core/render-utils";
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Panel from "@/components/panel";
import BodySvg from "./components/body-svg";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";

interface Props {
  params: { slug: string; bodySlug: string };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { data: body } = await getResource<SystemBodyResource>(`bodies/${params.bodySlug}`);
  return {
    title: `${body.name} | Survey Report | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/systems/${params.slug}/body/${params.bodySlug}`,
      title: `${body.name} | Survey Report | ${(await parent).title?.absolute}`,
      description: `Survey report for ${body.name}: ${body.sub_type} in ${body.system?.name}.`,
    },
    description: `Survey report for ${body.name}: ${body.sub_type} in ${body.system?.name}.`,
  };
}

/* ── Shared sub-components ─────────────────────────────── */

const StatRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-neutral-900 py-2">
    <span className="text-xs uppercase tracking-widest text-neutral-600">{label}</span>
    <span className="text-right text-xs uppercase tracking-wider text-neutral-300">{value}</span>
  </div>
);

const Yes = () => <span className="text-green-400">Yes</span>;
const No  = () => <span className="text-red-400/80">No</span>;


/* ── Page ──────────────────────────────────────────────── */

export default async function Page({ params }: Props) {
  const { data: body } = await getResource<SystemBodyResource>(`bodies/${params.bodySlug}`, {
    params: { withStations: 1 },
  });

  const isStar   = body.type === SystemBodyType.Star || body.sub_type?.includes("Star");
  const bodyIcon = isStar ? "icarus-terminal-star" : "icarus-terminal-planet";

  const settlements: Station[] = (body.system?.stations ?? []).filter(
    (station) => station.body?.name === body.name && PLANETARY_BASES.includes(station.type),
  );

  return (
    <>
      {/* ── Survey Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:SURVEY"
        protocolLabel={`DATABASE:${isStar ? "STELLAR" : "PLANETARY"}`}
        statusLabel="SCAN: COMPLETE"
      />

      {/* ── Breadcrumb / survey nav ── */}
      <BreadcrumbNav
        backHref={`/systems/${params.slug}`}
        backLabel={`Back to ${body.system?.name}`}
        rightIcon="icarus-terminal-scan"
        rightLabel={`SURVEY REPORT — ${body.name}`}
      />

      {/* ── Hero panel ── */}
      <div className="fx-chamfer fx-panel-scan relative mb-5 border border-sky-900/40 rounded-xl bg-black/50 backdrop-blur backdrop-filter">
        <div className="flex flex-col items-center gap-4 p-4 md:flex-row md:gap-8 md:p-8">

          {/* SVG body — width caps the rendered SVG via arbitrary child selectors */}
          <div className="flex w-40 shrink-0 items-center justify-center md:w-[220px] [&>svg]:!h-auto [&>svg]:!w-full">
            <BodySvg body={body} size={220} />
          </div>

          {/* Identity */}
          <div className="w-full flex-1 space-y-4">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
              <Link href="/systems" className="transition-colors hover:text-sky-400">Systems</Link>
              <span>/</span>
              <Link href={`/systems/${params.slug}`} className="transition-colors hover:text-sky-400">
                {body.system?.name}
              </Link>
              <span>/</span>
              <span className="text-neutral-500">{body.name}</span>
            </div>

            {/* Name + type */}
            <div>
              <div className="mb-1 flex items-center gap-3">
                <i className={`${bodyIcon} text-glow__blue text-2xl md:text-[2rem]`} />
                <h1 className="text-glow__white text-xl font-bold uppercase tracking-wide md:text-3xl">
                  {body.name}
                </h1>
              </div>
              <p className="text-glow__blue text-xs font-bold uppercase tracking-widest md:text-sm">
                {body.sub_type}
                {body.terraforming_state === "Candidate for terraforming" && (
                  <span className="ml-2 block text-green-400 md:ml-3 md:inline">— Terraforming Candidate</span>
                )}
              </p>
            </div>

            {/* Quick-stats row */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-sky-900/20 pt-4 text-xs uppercase tracking-widest sm:flex sm:flex-wrap sm:gap-x-8">
              {body.distance_to_arrival ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Dist. to Arrival</p>
                  <p className="font-bold text-neutral-300">{formatNumber(body.distance_to_arrival)} LS</p>
                </div>
              ) : null}
              {body.surface_temp ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Surface Temp</p>
                  <p className="font-bold text-neutral-300">{formatNumber(body.surface_temp)} K</p>
                </div>
              ) : null}
              {body.gravity ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Gravity</p>
                  <p className="font-bold text-neutral-300">{body.gravity.toFixed(2)} G</p>
                </div>
              ) : null}
              {body.earth_masses ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Earth Masses</p>
                  <p className="font-bold text-neutral-300">{body.earth_masses.toFixed(4)}</p>
                </div>
              ) : null}
              {isStar && body.solar_masses ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Solar Masses</p>
                  <p className="font-bold text-neutral-300">{body.solar_masses}</p>
                </div>
              ) : null}
              {body.is_landable !== undefined && !isStar && (
                <div>
                  <p className="mb-0.5 text-neutral-600">Landable</p>
                  <p className="font-bold">{body.is_landable ? <Yes /> : <No />}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Discovery */}
          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Discovery Record" />
            <StatRow label="Discovered By" value={<span className="text-glow__blue">CMDR {body.discovery?.commander ?? "Unknown"}</span>} />
            <StatRow label="Discovery Date" value={formatDate(body.discovery?.date)} />
          </Panel>

          {/* Star data */}
          {isStar && (
            <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
              <SectionHeader icon="icarus-terminal-star" title="Stellar Data" />
              <StatRow label="Spectral Class"  value={body.spectral_class  ?? "—"} />
              <StatRow label="Luminosity"      value={body.luminosity      ?? "—"} />
              <StatRow label="Solar Masses"    value={body.solar_masses    ?? "—"} />
              <StatRow label="Solar Radius"    value={body.solar_radius != null ? body.solar_radius.toFixed(4) : "—"} />
              <StatRow label="Main Star"       value={body.is_main_star  ? <Yes /> : <No />} />
              <StatRow label="Scoopable"       value={body.is_scoopable  ? <Yes /> : <No />} />
            </Panel>
          )}

          {/* Surface data */}
          {!isStar && (
            <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
              <SectionHeader icon="icarus-terminal-planet" title="Surface Data" />
              <StatRow label="Atmosphere"    value={body.atmosphere_type  || "None"} />
              <StatRow label="Volcanism"     value={body.volcanism_type   || "None"} />
              <StatRow label="Terraforming"  value={
                body.terraforming_state === "Candidate for terraforming"
                  ? <span className="text-green-400">{body.terraforming_state}</span>
                  : <span className="text-neutral-500">{body.terraforming_state ?? "Not Applicable"}</span>
              } />
              <StatRow label="Landable"      value={body.is_landable ? <Yes /> : <No />} />
              <StatRow label="Radius"        value={body.radius != null ? `${formatNumber(body.radius)} KM` : "—"} />
            </Panel>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Orbital mechanics */}
          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-system-orbits" title="Orbital Mechanics" />
            <StatRow label="Orbital Period"    value={formatOrbitalPeriod(body.orbital?.orbital_period)} />
            <StatRow label="Inclination"       value={body.orbital?.orbital_inclination != null ? `${body.orbital.orbital_inclination.toFixed(4)}°` : "—"} />
            <StatRow label="Eccentricity"      value={body.orbital?.orbital_eccentricity != null ? body.orbital.orbital_eccentricity.toFixed(6)     : "—"} />
            <StatRow label="Arg of Periapsis"  value={body.orbital?.arg_of_periapsis    != null ? body.orbital.arg_of_periapsis.toFixed(4)          : "—"} />
            <StatRow label="Semi-Major Axis"   value={body.axial?.semi_major_axis       != null ? body.axial.semi_major_axis.toFixed(6)             : "—"} />
            <StatRow label="Axial Tilt"        value={body.axial?.axial_tilt            != null ? `${(body.axial.axial_tilt * 180 / Math.PI).toFixed(4)}°` : "—"} />
            {!isStar && (
              <StatRow label="Tidally Locked"  value={body.axial?.is_tidally_locked ? <Yes /> : <No />} />
            )}
          </Panel>

          {/* Ring system */}
          {body.rings && body.rings.length > 0 && (
            <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
              <SectionHeader icon="icarus-terminal-planet-ringed" title="Ring System" />
              <div className="space-y-4">
                {body.rings.map((ring: SystemBodyRing) => (
                  <div key={ring.name} className="border-b border-neutral-900 pb-4 last:border-0 last:pb-0">
                    <p className="text-glow__blue mb-2 text-xs font-bold uppercase tracking-widest">{ring.name}</p>
                    <StatRow label="Type"         value={ring.type} />
                    <StatRow label="Mass"         value={`${formatNumber(ring.mass)} KG`} />
                    <StatRow label="Inner Radius" value={`${formatNumber(ring.innerRadius)} KM`} />
                    <StatRow label="Outer Radius" value={`${formatNumber(ring.outerRadius)} KM`} />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* ── Planetary settlements ── */}
      {settlements.length > 0 && (
        <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
          <SectionHeader icon="icarus-terminal-settlement" title="Planetary Settlements" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="relative border border-sky-900/20 p-3">
                <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/60" />
                <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/60" />
                <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/60" />
                <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/60" />
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <Link
                    href={`/stations/${settlement.slug}`}
                    className="text-glow__blue flex items-center"
                  >
                    <i className={`${stationIconByType(settlement.type)} text-glow me-2 text-sm`}></i>
                    {settlement.name}
                  </Link>
                  <span className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                    {settlement.type}
                  </span>
                </div>
                <p className="mb-2 text-xs uppercase tracking-wider text-neutral-600">
                  {settlement.economy || "Unknown"} Economy
                  {settlement.allegiance ? ` • ${settlement.allegiance}` : ""}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                  {settlement.has_market && (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="h-3 w-3 text-sky-500/60" />
                      Market
                    </span>
                  )}
                  {settlement.has_outfitting && (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="h-3 w-3 text-sky-500/60" />
                      Outfitting
                    </span>
                  )}
                  {settlement.has_shipyard && (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="h-3 w-3 text-sky-500/60" />
                      Shipyard
                    </span>
                  )}
                  {!settlement.has_market && !settlement.has_outfitting && !settlement.has_shipyard && (
                    <span className="text-neutral-700">No docking services</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

    </>
  );
}
