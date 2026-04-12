import type { Pagination } from "./interfaces/Pagination";
import { settings } from "./config";

export const pagination = {
  data: [],
  links: {
    first: "",
    last: "",
    next: null,
    prev: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    path: "",
    per_page: 10,
    to: 0,
  },
};

export function isAbsoluteUrl(url: string) {
  return url.indexOf("http://") === 0 || url.indexOf("https://") === 0;
}

export async function request<T = unknown>(uri: string, options?: RequestOptions): Promise<T> {
  const url = !isAbsoluteUrl(uri) ? `${settings.api.url}/${uri}` : uri;
  const query = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>) : "";

  const fetchOptions: RequestInit = {};

  if (options?.tags?.length) {
    (fetchOptions as RequestInit & { next?: { tags: string[] } }).next = { tags: options.tags };
  }
  if (options?.headers) {
    fetchOptions.headers = options.headers;
  }
  if (options?.cache) {
    fetchOptions.cache = options.cache;
  }

  const response = await fetch(`${url}${query}`, fetchOptions);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  tags?: string[];
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export async function getCollection<T>(
  uri: string,
  options?: RequestOptions,
): Promise<Pagination<T>> {
  return await request(uri, options);
}

export async function getResource<T>(uri: string, options?: RequestOptions): Promise<{ data: T }> {
  return await request(uri, options);
}
