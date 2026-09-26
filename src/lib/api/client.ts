const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!envBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const API_BASE_URL: string = envBaseUrl;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  // FormData ke saath Content-Type manually set mat karo.
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token?.trim()) {
    headers.set(
      "Authorization",
      `Bearer ${token.trim()}`
    );
  }

  // Remove trailing slash from base URL
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");

  // Remove leading slash from endpoint
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  const url = `${baseUrl}/${cleanEndpoint}`;

  console.log("[apiFetch] REQUEST", {
    method: options.method || "GET",
    url,
    endpoint,
    hasToken: Boolean(token?.trim()),
  });

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  /*
   * Response ko pehle text ke form mein read karte hain.
   * Isse empty response / HTML error / invalid JSON bhi clearly dikhega.
   */
  const rawText = await response.text();

  let data: unknown = null;

  if (rawText.trim()) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  console.log("[apiFetch] RESPONSE", {
    status: response.status,
    statusText: response.statusText,
    url,
    data,
  });

  if (!response.ok) {
    console.error("[apiFetch] ERROR", {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      url,
      response: data,
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }

      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "You are not authorized to access this resource."
      );
    }

    if (response.status === 404) {
      throw new Error(
        `API endpoint not found: ${endpoint}`
      );
    }

    if (response.status >= 500) {
      throw new Error(
        "Server error. Please check the backend API."
      );
    }

    if (typeof data === "string" && data.trim()) {
      throw new Error(data);
    }

    if (
      typeof data === "object" &&
      data !== null
    ) {
      const errorData = data as {
        detail?: string;
        message?: string;
        error?: string;
        errors?: unknown;
      };

      if (errorData.detail) {
        throw new Error(errorData.detail);
      }

      if (errorData.message) {
        throw new Error(errorData.message);
      }

      if (errorData.error) {
        throw new Error(errorData.error);
      }

      if (errorData.errors) {
        throw new Error(
          typeof errorData.errors === "string"
            ? errorData.errors
            : JSON.stringify(errorData.errors)
        );
      }
    }

    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  /*
   * 204 No Content / empty response
   */
  if (response.status === 204 || !rawText.trim()) {
    return null as T;
  }

  return data as T;
}
