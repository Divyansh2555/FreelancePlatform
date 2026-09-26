const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined"
  );
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (
      typeof data === "object" &&
      data !== null
    ) {
      const errorData = data as {
        detail?: string;
        message?: string;
      };

      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Request failed with status ${response.status}`
      );
    }

    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  return data as T;
}