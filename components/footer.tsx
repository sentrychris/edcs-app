"use client";

import { useEffect, useState, type FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";

const STORAGE_KEY = "edcs:footer-collapsed";

const statusReadouts = [
  { icon: "icarus-terminal-shield", label: "CMDR Verified", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-planet-life", label: "Life Support: Nominal", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-route", label: "Nav: Online", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-notifications", label: "Galnet: Live", color: "bg-sky-500", pulse: true },
  { icon: "icarus-terminal-sync", label: "EDDN: Sync", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-system-orbits", label: "Cartography: Active", color: "bg-green-400", pulse: false },
];

const Footer: FunctionComponent = () => {
  // Default to expanded for SSR; hydrate the persisted value on mount.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setCollapsed(true);
      }
    } catch {
      // localStorage may be unavailable (private mode, etc.) — fall back to default
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore — state still toggles in-memory
      }
      return next;
    });
  };

  return (
    <footer className="mt-6 border-t border-sky-900/20 bg-transparent backdrop-blur backdrop-filter">

      {/* ── Collapse Toggle ── */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!collapsed}
        aria-controls="footer-content"
        className="group flex w-full items-center justify-center gap-3 border-b border-sky-900/20 py-1.5 text-[0.7rem] uppercase tracking-widest text-neutral-600 transition-colors hover:bg-sky-950/20 hover:text-sky-400"
      >
        <span className="h-px w-12 bg-sky-900/30 transition-colors group-hover:bg-sky-700/50" />
        <i
          className="icarus-terminal-chevron-right transition-transform"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(90deg)" }}
        />
        <span>{collapsed ? "Expand Terminal Footer" : "Collapse Terminal Footer"}</span>
        <i
          className="icarus-terminal-chevron-right transition-transform"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(90deg)" }}
        />
        <span className="h-px w-12 bg-sky-900/30 transition-colors group-hover:bg-sky-700/50" />
      </button>

      {!collapsed && (
        <div id="footer-content">
          {/* ── Ship Status Readouts ── */}
          <div className="scrollbar-hide lg:px-18 flex items-center gap-6 overflow-x-auto border-b border-sky-900/20 px-6 py-3 md:px-12 overflow-x-hidden">
            {statusReadouts.map(({ icon, label, color }) => (
              <div key={label} className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
                <span className={`h-1.5 w-1.5 ${color === "bg-sky-500" ? "fx-dot-blue" : "fx-dot-green"}`}></span>
                <i className={`${icon} text-neutral-600`}></i>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Footer Body ── */}
          <div className="grid grid-cols-1 gap-6 px-6 py-4 md:grid-cols-3 md:gap-8 md:py-3">

            {/* Left — System Identifier */}
            <div className="flex flex-col items-center gap-3 text-[0.65em] md:items-start">
              <div className="flex items-center gap-3">
                <i className="icarus-terminal-logo text-glow__blue text-2xl"></i>
                <div>
                  <p className="text-glow__blue font-bold uppercase tracking-widest">ED:CS Terminal</p>
                  <p className="uppercase tracking-wider text-neutral-600">Cartographic Intelligence System</p>
                </div>
              </div>
              <div className="flex items-center gap-3 uppercase tracking-widest text-neutral-700">
                <span>SYS:EDCS-001</span>
                <span>■</span>
                <span>BUILD:STABLE</span>
              </div>
            </div>

            {/* Centre — Legal */}
            <div className="flex flex-col gap-3 text-[0.65em] uppercase tracking-widest items-center">
              <div className="flex items-center gap-4">
                <Link
                  href="/legal/privacy-policy"
                  className="text-glow__blue transition-colors hover:text-sky-300"
                >
                  Privacy Policy
                </Link>
              </div>
              <p className="text-neutral-600 text-center">
                <span className="text-sky-500/60">Elite: Dangerous</span> © 2012 – {new Date().getFullYear()} Frontier Developments plc.
              </p>
              <p className="text-neutral-700 text-center">
                This website is not officially affiliated with or endorsed by Frontier Developments.
              </p>
            </div>

            {/* Right — Attribution + Data Sources */}
            <div className="flex flex-col gap-3 text-[0.65em] uppercase tracking-widest items-center md:items-end">
              <div className="flex items-center gap-1 text-neutral-500">
                {/* <i className="icarus-terminal-shield text-glow__blue"></i> */}
                <Image className="border border-sky-900/50 rounded me-2 grayscale"
                  src="/images/author.jpg" alt="Author" width={30} height={30}
                ></Image>
                <span>Built by</span>
                <a
                  href="https://github.com/sentrychris"
                  className="text-glow__blue"
                >
                  CMDR Shaki Kazaro
                </a>
              </div>
              <div className="flex flex-wrap gap-2 text-neutral-700">
                {["EDDN", "EDSM", "SPANSH", "INARA"].map((source, i, arr) => (
                  <span key={source} className="flex items-center gap-2">
                    <span className="text-sky-500/40">{source}</span>
                    {i < arr.length - 1 && <span>■</span>}
                  </span>
                ))}
              </div>
              <p className="text-neutral-700">Data sourced from community networks.</p>
            </div>

          </div>

          {/* ── Hull Integrity Bar ── */}
          <div className="lg:px-18 flex items-center gap-4 border-t border-sky-900/20 px-6 py-2 text-xs uppercase tracking-widest text-neutral-700 md:px-12">
            <span className="h-px flex-1 bg-neutral-900"></span>
            <span className="flex items-center gap-2">
              <i className="icarus-terminal-route text-sky-500/30"></i>
              FRONTIER DEVELOPMENTS ── UNIVERSAL CARTOGRAPHICS ── GALNET COMMUNICATIONS
            </span>
            <span className="h-px flex-1 bg-neutral-900"></span>
          </div>
        </div>
      )}

    </footer>
  );
};

export default Footer;
