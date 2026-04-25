import Panel from "./panel";

interface Props {
  state: "loading" | "error";
  icon: string;
  message: string;
}

export default function SearchStatusPanel({ state, icon, message }: Props) {
  if (state === "error") {
    return (
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-3 text-red-400/80">
          <i className={`${icon} text-base`}></i>
          <p className="text-xs uppercase tracking-widest">{message}</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="flex items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4">
        <i className={`${icon} text-glow__blue text-3xl`}></i>
        <p className="text-xs uppercase tracking-widest text-neutral-500">{message}</p>
      </div>
    </Panel>
  );
}
