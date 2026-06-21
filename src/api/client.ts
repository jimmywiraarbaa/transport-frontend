import { tokenStore } from "./tokens";
import type { ApiResponse } from "@/types";

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL ?? "";
const BASE = `${API_ORIGIN}/api/v1`;

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  auth?: boolean;
};

// ---- Token refresh state (prevents concurrent refresh storms) ----
let refreshing: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshing) return refreshing;
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;

  refreshing = (async () => {
    try {
      const resp = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const json = await resp.json();
      if (resp.ok && json.success) {
        tokenStore.set(json.data.access_token, json.data.refresh_token);
        return json.data.access_token as string;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

let onAuthFailure: (() => void) | null = null;

/** Register a callback for when authentication fails permanently (redirect to login). */
export function setAuthFailureHandler(fn: () => void) {
  onAuthFailure = fn;
}

async function request<T>(
  path: string,
  opts: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const { method = "GET", body, params, auth = true } = opts;

  let url = `${BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    }
    const qsStr = qs.toString();
    if (qsStr) url += `?${qsStr}`;
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content
  if (resp.status === 204) return undefined as T;

  // 401 → try refresh + retry once
  if (resp.status === 401 && auth && !isRetry && !path.startsWith("/auth/")) {
    const newToken = await tryRefresh();
    if (newToken) {
      return request<T>(path, opts, true);
    }
    // Refresh failed — clear and redirect
    tokenStore.clear();
    onAuthFailure?.();
  }

  const json: ApiResponse<T> = await resp.json();

  if (!resp.ok || !json.success) {
    const msg = json.error?.message ?? resp.statusText;
    throw new ApiError(resp.status, json.error?.code ?? "UNKNOWN", msg);
  }

  return json.data;
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    request<T>(path, { method: "GET", params }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
