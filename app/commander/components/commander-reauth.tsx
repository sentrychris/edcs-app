"use client";

import type { AuthorizationServerInformation } from "@/core/interfaces/Auth";
import { getResource } from "@/core/api";
import Panel from "@/components/panel";

export default function CommanderReauth() {
  const reauthorize = async () => {
    const { data } = await getResource<AuthorizationServerInformation>("auth/frontier/login");
    window.location.href = data.authorization_url;
  };

  return (
    <Panel className="px-6 py-8 text-center">
      <i className="icarus-terminal-warning mb-3 text-2xl text-sky-500/40"></i>
      <p className="mb-1 text-xs uppercase tracking-widest text-neutral-400">
        Frontier Authorization Expired
      </p>
      <p className="mb-5 text-xs uppercase tracking-widest text-neutral-700">
        Your Frontier access has expired. Please re-authorize to continue.
      </p>
      <button
        onClick={reauthorize}
        className="fx-btn-sweep inline-flex items-center gap-2 border border-sky-900/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-500/70 transition-colors hover:border-sky-500/60 hover:text-sky-400"
      >
        <i className="icarus-terminal-planet text-xs"></i>
        Re-authorize with Frontier
      </button>
    </Panel>
  );
}
