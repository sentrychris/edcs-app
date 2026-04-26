export interface CommanderApi {
  inara: string;
  edsm: string;
}

export interface CommanderLastSystem {
  name: string;
  slug: string;
}

export interface Commander {
  name: string;
  api?: CommanderApi;
  last_system?: CommanderLastSystem;
}
