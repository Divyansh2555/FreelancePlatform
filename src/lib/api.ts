const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {}
) {
  const {
    auth = false,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

  // Sirf authenticated request me token bhejo
  if (auth && typeof window !== "undefined") {
    const token =
      localStorage.getItem("access_token");

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers,
      cache: "no-store",
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  let data: unknown;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = "Request failed";

    if (
      data &&
      typeof data === "object"
    ) {
      const errorData =
        data as Record<string, unknown>;

      if (
        typeof errorData.detail === "string"
      ) {
        errorMessage = errorData.detail;
      } else if (
        typeof errorData.message === "string"
      ) {
        errorMessage = errorData.message;
      } else if (
        typeof errorData.error === "string"
      ) {
        errorMessage = errorData.error;
      }
    } else if (
      typeof data === "string" &&
      data.trim()
    ) {
      errorMessage = data;
    }

    throw new Error(errorMessage);
  }

  return data;
}
