import { cn } from "./cn";

export const renderSecurityText = (level: string = "None", suffix = "") => (
  <span
    className={cn(
      "uppercase tracking-wide",
      level === "Medium"
        ? "text-sky-300"
        : ["Low", "Anarchy", "None", "No"].includes(level)
          ? "text-red-300"
          : "text-green-300",
    )}
  >
    {level} {suffix}
  </span>
);

export const renderAllegianceText = (value: string = "None") => (
  <span
    className={cn(
      "uppercase tracking-wide",
      ["Federation", "Alliance"].includes(value)
        ? "text-glow__blue"
        : value === "Empire"
          ? "text-yellow-400"
          : value === "Independent"
            ? "text-green-300"
            : "text-stone-300",
    )}
  >
    {value}
  </span>
);

export const stationIconByType = (type: string): string => {
  if (type === "Coriolis Starport") return "icarus-terminal-coriolis-starport";
  if (type === "Outpost") return "icarus-terminal-outpost";
  if (type === "Asteroid base") return "icarus-terminal-asteroid-base";
  if (type === "Ocellus Starport") return "icarus-terminal-ocellus-starport";
  if (type === "Mega ship") return "icarus-terminal-megaship";
  return "icarus-terminal-orbis-starport";
};
