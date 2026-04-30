"use client";

import { useEffect, useState, type FunctionComponent } from "react";

interface Banner {
  glyph:    string;
  brand:    string;
  tagline:  string;
  category: Category;   // chip text — varies per banner
}

type Category = "Sponsored" | "Promo" | "Bulletin" | "Channel" | "Notice";

const BANNERS: Banner[] = [
  // ── Megacorp shipyards ──────────────────────────────────────────────────────
  { glyph: "⬡", brand: "SIRIUS INC",            category: "Sponsored", tagline: "Powering the Frontier — FSD · Power Plants · Fuel Systems"      },
  { glyph: "◇", brand: "LAKON SPACEWAYS",       category: "Sponsored", tagline: "Built for the Vast — Type-9 · Asp Explorer · Anaconda"          },
  { glyph: "⬢", brand: "FAULCON DELACY",        category: "Sponsored", tagline: "Forged in Combat — Cobra Mk III · Viper · Python"              },
  { glyph: "◈", brand: "SAUD KRUGER",           category: "Sponsored", tagline: "Travel in Comfort — Beluga Liner · Dolphin · Orca"             },
  { glyph: "✧", brand: "GUTAMAYA",              category: "Sponsored", tagline: "Imperial Elegance — Cutter · Clipper · Courier · Eagle"        },
  { glyph: "◢", brand: "CORE DYNAMICS",         category: "Sponsored", tagline: "Federal Steel — Corvette · Gunship · Dropship · Assault"       },
  { glyph: "◐", brand: "ZORGON PETERSON",       category: "Sponsored", tagline: "Workhorses of the Bubble — Hauler · Adder · Keelback · Orca"  },
  { glyph: "◆", brand: "ACHILLES CORP.",        category: "Sponsored", tagline: "Modules of Distinction — Power Plants · Shields · Drives"      },
  // ── Iconic locations ────────────────────────────────────────────────────────
  { glyph: "☕", brand: "HUTTON ORBITAL",        category: "Promo",     tagline: "The Galaxy's Finest Mug — only 6.7 Mm from drop-out"           },
  { glyph: "⊕", brand: "JAMESON MEMORIAL",      category: "Promo",     tagline: "Founders World — every module, every ship, no permit"          },
  // ── Civic / network ─────────────────────────────────────────────────────────
  { glyph: "⌖", brand: "PILOTS FEDERATION",     category: "Bulletin",  tagline: "Welcome, Commander — Combat Bonds · Trade Standings · Honour" },
  { glyph: "⊙", brand: "UNIVERSAL CARTOGRAPHICS",category:"Bulletin",  tagline: "Map Every Star — First Discovery Bonus · Codex Honour"        },
  { glyph: "✦", brand: "VOX GALACTICA",         category: "Channel",   tagline: "The Voice of the Bubble — News · Insight · Truth, hourly"     },
  // ── Powers / political figures ──────────────────────────────────────────────
  { glyph: "✺", brand: "AISLING DUVAL",         category: "Notice",    tagline: "For the People — Imperial Princess, friend of the Bubble"     },
  { glyph: "▲", brand: "ZACHARY HUDSON",        category: "Notice",    tagline: "Strength Through Unity — President of the Federation"          },
  { glyph: "❖", brand: "EDMUND MAHON",          category: "Notice",    tagline: "Alliance for the Stars — Trade · Independence · Strength"     },
  { glyph: "ϟ", brand: "DENTON PATREUS",        category: "Notice",    tagline: "Imperial Munitions — Senator Patreus · Defense Contracts"     },
  { glyph: "◯", brand: "ARCHON DELAINE",        category: "Channel",   tagline: "Kumo Crew — Profitable Liaisons, no questions asked"          },
  { glyph: "△", brand: "PRANAV ANTAL",          category: "Notice",    tagline: "Utopia — A galaxy of harmonious purpose"                       },
  { glyph: "✱", brand: "LI YONG-RUI",           category: "Notice",    tagline: "Sirius Government — Markets · Discounts · Prosperity"          },
];

interface Tone {
  outerBorder: string;
  outerBg:     string;
  corner:      string;
  tagBorder:   string;
  tagText:     string;
  glyph:       string;
  brand:       string;
  pulse:       string;
}

// ── Per-category palette — same opacity stops as the prohibited-goods chip ──
// (Tailwind needs literal class strings, so each tone is enumerated.)
const TONES: Record<Category, Tone> = {
  Sponsored: {
    outerBorder: "border-amber-900/40",
    outerBg:     "bg-amber-950/10",
    corner:      "border-amber-500/40",
    tagBorder:   "border-amber-500/30",
    tagText:     "text-amber-500/70",
    glyph:       "text-amber-400/80",
    brand:       "text-amber-300/90",
    pulse:       "bg-amber-500/60",
  },
  Promo: {
    outerBorder: "border-orange-900/40",
    outerBg:     "bg-orange-950/10",
    corner:      "border-orange-500/40",
    tagBorder:   "border-orange-500/30",
    tagText:     "text-orange-400/70",
    glyph:       "text-orange-400/80",
    brand:       "text-orange-300/90",
    pulse:       "bg-orange-500/60",
  },
  Bulletin: {
    outerBorder: "border-sky-900/40",
    outerBg:     "bg-sky-950/10",
    corner:      "border-sky-500/40",
    tagBorder:   "border-sky-500/30",
    tagText:     "text-sky-400/70",
    glyph:       "text-sky-400/80",
    brand:       "text-sky-300/90",
    pulse:       "bg-sky-500/60",
  },
  Channel: {
    outerBorder: "border-emerald-900/40",
    outerBg:     "bg-emerald-950/10",
    corner:      "border-emerald-500/40",
    tagBorder:   "border-emerald-500/30",
    tagText:     "text-emerald-400/70",
    glyph:       "text-emerald-400/80",
    brand:       "text-emerald-300/90",
    pulse:       "bg-emerald-500/60",
  },
  Notice: {
    outerBorder: "border-rose-900/40",
    outerBg:     "bg-rose-950/10",
    corner:      "border-rose-500/40",
    tagBorder:   "border-rose-500/30",
    tagText:     "text-rose-400/70",
    glyph:       "text-rose-400/80",
    brand:       "text-rose-300/90",
    pulse:       "bg-rose-500/60",
  },
};

const ROTATION_MS = 12_000;

const SponsorBanner: FunctionComponent = () => {
  // SSR-safe initial: always start at 0 to avoid hydration mismatch.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick a random starting banner once mounted.
    setIndex(Math.floor(Math.random() * BANNERS.length));

    const id = setInterval(() => {
      setIndex((prev) => {
        // Random next, but never the same as the current one.
        let next = Math.floor(Math.random() * BANNERS.length);
        if (next === prev) next = (next + 1) % BANNERS.length;
        return next;
      });
    }, ROTATION_MS);

    return () => clearInterval(id);
  }, []);

  const banner = BANNERS[index];
  const tone   = TONES[banner.category];

  return (
    <div
      className={[
        "fx-btn-sweep relative hidden min-w-0 flex-1 items-center justify-center gap-3",
        "overflow-hidden border px-4 py-1.5 backdrop-blur backdrop-filter",
        "transition-colors duration-500 lg:flex",
        tone.outerBorder, tone.outerBg,
      ].join(" ")}
    >
      {/* Corner brackets */}
      <span className={`pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t transition-colors duration-500 ${tone.corner}`} />
      <span className={`pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 border-r border-t transition-colors duration-500 ${tone.corner}`} />
      <span className={`pointer-events-none absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l transition-colors duration-500 ${tone.corner}`} />
      <span className={`pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r transition-colors duration-500 ${tone.corner}`} />

      {/* Animated payload — keyed so React remounts it on rotation,
          which re-fires the fx-fade-in animation. */}
      <div
        key={index}
        className="fx-fade-in flex min-w-0 flex-1 items-center justify-center gap-3"
      >
        {/* Category tag */}
        <span className={`shrink-0 border bg-black/40 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-widest ${tone.tagBorder} ${tone.tagText}`}>
          {banner.category}
        </span>

        {/* Brand */}
        <span className={`shrink-0 text-[0.7rem] font-bold uppercase tracking-widest ${tone.brand}`}>
          <span className={`mr-1 ${tone.glyph}`}>{banner.glyph}</span>
          {banner.brand}
        </span>

        <span className="hidden shrink-0 text-neutral-700 xl:inline">::</span>

        {/* Tagline */}
        <span className="hidden truncate text-[0.65rem] uppercase tracking-widest text-neutral-400 xl:inline">
          {banner.tagline}
        </span>
      </div>

      {/* Trailing pulse */}
      <span className={`ml-1 h-1 w-1 shrink-0 transition-colors duration-500 ${tone.pulse}`} />
    </div>
  );
};

export default SponsorBanner;
