import type { Message } from "../../types/chat";

export function normalizeMessage(value: unknown): Message | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const data = value as Record<string, unknown>;

  return {
    id:
      typeof data.id === "number" ||
      typeof data.id === "string"
        ? data.id
        : null,

    conversation_id:
      typeof data.conversation_id === "number" ||
      typeof data.conversation_id === "string"
        ? data.conversation_id
        : null,

    sender_id:
      typeof data.sender_id === "number" ||
      typeof data.sender_id === "string"
        ? data.sender_id
        : null,

    receiver_id:
      typeof data.receiver_id === "number" ||
      typeof data.receiver_id === "string"
        ? data.receiver_id
        : null,

    message:
      typeof data.message === "string"
        ? data.message
        : typeof data.content === "string"
          ? data.content
          : "",

    is_read:
      typeof data.is_read === "boolean"
        ? data.is_read
        : false,

    created_at:
      typeof data.created_at === "string"
        ? data.created_at
        : typeof data.createdAt === "string"
          ? data.createdAt
          : new Date().toISOString(),
  };
}

export function mergeMessages(
  oldMessages: Message[],
  newMessages: Message[]
): Message[] {
  const map = new Map<string, Message>();

  [...oldMessages, ...newMessages].forEach((item, index) => {
    const key =
      item.id !== null
        ? `id-${item.id}`
        : `temp-${item.sender_id}-${item.created_at}-${item.message}-${index}`;

    map.set(key, item);
  });

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

export function getCurrentUserId(): number | null {
  const token = getToken();

  if (!token) return null;

  try {
    const parts = token.split(".");

    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      base64 +
      "=".repeat((4 - (base64.length % 4)) % 4);

    const payload = JSON.parse(
      window.atob(padded)
    );

    const id = Number(payload.sub);

    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

export function formatTime(
  date: string | null | undefined
): string {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitial(name = ""): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}