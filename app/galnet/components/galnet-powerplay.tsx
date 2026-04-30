// TODO: Replace stub data with API response when the powerplay endpoint is available.

interface Power {
  rank:     number;
  name:     string;
  short:    string;
  faction:  "Empire" | "Federation" | "Alliance" | "Independent";
  systems:  number;
  rating:   number;
  trend:    "up" | "down" | "flat";
}

const POWERS: Power[] = [
  { rank: 1,  name: "Edmund Mahon",           short: "Mahon",    faction: "Alliance",     systems: 86,  rating: 9821, trend: "flat" },
  { rank: 2,  name: "Aisling Duval",           short: "Duval",    faction: "Empire",       systems: 74,  rating: 8634, trend: "up"   },
  { rank: 3,  name: "Li Yong-Rui",             short: "LYR",      faction: "Independent",  systems: 71,  rating: 8102, trend: "up"   },
  { rank: 4,  name: "Felicia Winters",         short: "Winters",  faction: "Federation",   systems: 68,  rating: 7789, trend: "down" },
  { rank: 5,  name: "Arissa Lavigny-Duval",   short: "ALD",      faction: "Empire",       systems: 62,  rating: 7214, trend: "down" },
  { rank: 6,  name: "Zachary Hudson",          short: "Hudson",   faction: "Federation",   systems: 58,  rating: 6880, trend: "flat" },
  { rank: 7,  name: "Yuri Grom",              short: "Grom",     faction: "Independent",  systems: 44,  rating: 5341, trend: "up"   },
  { rank: 8,  name: "Denton Patreus",         short: "Patreus",  faction: "Empire",       systems: 39,  rating: 4892, trend: "down" },
  { rank: 9,  name: "Pranav Antal",           short: "Antal",    faction: "Independent",  systems: 31,  rating: 3760, trend: "flat" },
  { rank: 10, name: "Archon Delaine",         short: "Delaine",  faction: "Independent",  systems: 24,  rating: 2943, trend: "down" },
  { rank: 11, name: "Zemina Torval",          short: "Torval",   faction: "Empire",       systems: 18,  rating: 1820, trend: "up"   },
];

const factionColour: Record<Power["faction"], string> = {
  Empire:      "text-amber-400/70",
  Federation:  "text-sky-400/70",
  Alliance:    "text-emerald-400/70",
  Independent: "text-neutral-500",
};

const trendIcon: Record<Power["trend"], { glyph: string; colour: string }> = {
  up:   { glyph: "▲", colour: "text-emerald-500/80" },
  down: { glyph: "▼", colour: "text-red-400/80"     },
  flat: { glyph: "■", colour: "text-neutral-700"    },
};

export default function GalnetPowerplay() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-sky-900/20 pb-3">
        <div>
          <p className="font-bold uppercase tracking-widest text-neutral-400">
            Powerplay Rankings
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-neutral-700">
            Cycle standings · Galactic Powers
          </p>
        </div>
        <span className="border border-sky-900/30 px-1.5 py-0.5 text-xs uppercase tracking-widest text-neutral-700">
          Cycle 423
        </span>
      </div>

      {/* Rankings */}
      <div className="space-y-px">
        {POWERS.map((power) => {
          const trend = trendIcon[power.trend];

          return (
            <div
              key={power.rank}
              className="flex items-center gap-2 border-b border-sky-900/10 py-1.5 last:border-b-0"
            >
              {/* Rank */}
              <span className="w-4 shrink-0 text-[0.7rem] tabular-nums text-neutral-700">
                {power.rank}
              </span>

              {/* Name + faction */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.7rem] font-bold uppercase tracking-wide text-neutral-400">
                  {power.short === power.name ? power.name : power.name}
                </p>
                <p className={`text-[0.7rem] uppercase tracking-widest ${factionColour[power.faction]}`}>
                  {power.faction}
                </p>
              </div>

              {/* Systems */}
              <div className="text-right">
                <p className="text-[0.7rem] tabular-nums text-neutral-500">{power.systems}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-neutral-800">sys</p>
              </div>

              {/* Trend */}
              <span className={`w-3 shrink-0 text-center text-[0.7rem] ${trend.colour}`}>
                {trend.glyph}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[0.65rem] uppercase tracking-widest text-neutral-800">
        Source: GalNet Intelligence Bureau · Not real-time
      </p>
    </div>
  );
}
