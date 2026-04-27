import type { AppSettings } from "./interfaces/Settings";

function parseBoolean(value: string | undefined): boolean {
  return ["1", "true", "yes", "on"].includes((value ?? "").toLowerCase());
}

/**
 * App settings
 */
export const settings: AppSettings = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    url: process.env.NEXT_PUBLIC_APP_URL,
    maintenanceMode: parseBoolean(process.env.MAINTENANCE_MODE),
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
    auth: {
      basic: {
        secret: process.env.BASIC_SECRET,
      },
      jwt: {
        accessToken: {
          signingSecret: process.env.JWT_ACCESS_TOKEN_SIGNING_SECRET,
          expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
        },
        refreshToken: {
          signingSecret: process.env.JWT_REFRESH_TOKEN_SIGNING_SECRET,
          expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
        },
      },
    },
  },
};
