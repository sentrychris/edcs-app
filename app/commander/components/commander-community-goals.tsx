import type { FunctionComponent } from "react";
import type { CAPICommunityGoal } from "@/core/interfaces/CAPIProfile";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

interface Props {
  goals: CAPICommunityGoal[];
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

const numberFormatter = new Intl.NumberFormat("en-GB");

function parseFrontierDate(value: string): Date {
  return new Date(`${value.replace(" ", "T")}Z`);
}

function formatRemaining(expiry: string): string {
  const ms = parseFrontierDate(expiry).getTime() - Date.now();

  if (ms <= 0) {
    return "Expired";
  }

  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h`;
}

function goalProgress(goal: CAPICommunityGoal): number {
  if (goal.target_qty <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (goal.qty / goal.target_qty) * 100));
}

function goalObjectives(goal: CAPICommunityGoal): string[] {
  return goal.objective
    .split(",")
    .map((objective) => objective.trim())
    .filter(Boolean)
    .slice(0, 5);
}

const CommanderCommunityGoals: FunctionComponent<Props> = ({ goals }) => (
  <Panel className="p-5">
    <SectionHeader
      icon="icarus-terminal-notifications"
      title={`Community Goals — ${goals.length} active`}
      className="mb-4"
    />

    {goals.length === 0 ? (
      <div className="border border-sky-900/20 bg-black/40 p-3">
        <p className="text-[0.65rem] uppercase tracking-widest text-neutral-700">
          No active assignments
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = goalProgress(goal);
          const objectives = goalObjectives(goal);

          return (
            <div key={goal.id} className="border border-sky-900/20 bg-black/40 p-3">
              <div className="mb-3 flex items-start gap-2">
                <i className="icarus-terminal-signal mt-0.5 shrink-0 text-xs text-sky-500/30" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] font-bold uppercase leading-tight tracking-wide text-sky-400/80">
                    {goal.title}
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-neutral-700">
                    {goal.market_name} · {goal.starsystem_name}
                  </p>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 text-[0.7rem] uppercase tracking-widest">
                <div>
                  <p className="text-neutral-700">Expires</p>
                  <p className="mt-0.5 text-neutral-400">
                    {dateFormatter.format(parseFrontierDate(goal.expiry))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-700">Remaining</p>
                  <p className="mt-0.5 text-sky-400/70">{formatRemaining(goal.expiry)}</p>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-widest">
                  <span className="text-neutral-600">{goal.activityType}</span>
                  <span className="text-sky-400/70">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-[2px] w-full bg-sky-900/20">
                  <div
                    className="h-full bg-sky-500/50"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-neutral-700">
                  {numberFormatter.format(goal.qty)} / {numberFormatter.format(goal.target_qty)}
                </p>
              </div>

              {objectives.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-sky-900/10 pt-3">
                  {objectives.map((objective) => (
                    <span
                      key={`${goal.id}_${objective}`}
                      className="border border-sky-900/20 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600"
                    >
                      {objective}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </Panel>
);

export default CommanderCommunityGoals;
