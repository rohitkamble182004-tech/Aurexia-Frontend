// lib/api/client.ts

const API_URL: string | undefined =
  process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

/**
 * Safely read auth token (client-only)
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Base API fetch
 * - Supports JSON
 * - Supports FormData (multipart/form-data)
 * - Supports empty (204) responses
 *
 * ⚠️ LOW-LEVEL: may return void
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | void> {
  const headers = new Headers(options.headers);

  // Detect FormData
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  // Only set JSON header if NOT FormData
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[API ${res.status}] ${text || res.statusText}`
    );
  }

  // No Content
  if (res.status === 204) {
    return;
  }

  const text = await res.text();
  if (!text) {
    return;
  }

  return JSON.parse(text) as T;
}

/**
 * ✅ STRICT JSON FETCH
 * - Always returns JSON
 * - NEVER returns void
 * - Throws if body is empty
 *
 * 👉 Use this for all storefront / page data
 */
export async function apiFetchJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const result = await apiFetch<T>(path, options);

  if (result === undefined) {
    throw new Error(
      "Expected JSON response but received empty body"
    );
  }

  return result;
}

/**
 * 🔐 Admin fetch (JWT protected)
 */
export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | void> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token missing");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return apiFetch<T>(path, {
    ...options,
    headers,
  });
}
