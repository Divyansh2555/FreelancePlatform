import type {
  User,
  Conversation,
  Message,
  WebSocketMessage,
} from "../../../types/chat";

import {
  normalizeMessage,
} from "../../utils/chat";

// =====================================================
// API CONFIG
// =====================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  "ws://127.0.0.1:8000";

// =====================================================
// API ERROR
// =====================================================

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `Request failed: ${response.status}`
    );
  }

  return data;
}

// =====================================================
// GET USERS
// =====================================================

export async function getUsers(
  token: string,
  search = "",
  signal?: AbortSignal
): Promise<User[]> {
  const response = await fetch(
    `${API_URL}/chat/users?search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal,
      cache: "no-store",
    }
  );

  const data = await handleResponse(response);

  if (!Array.isArray(data)) return [];

  return data.filter(
    (user): user is User =>
      (
        typeof user?.id === "number" ||
        typeof user?.id === "string"
      ) &&
      typeof user.name === "string"
  );
}

// =====================================================
// GET / CREATE CONVERSATION
// =====================================================

export async function getConversation(
  token: string,
  userId: number | string,
  signal?: AbortSignal
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/chat/conversation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: Number(userId),
      }),
      signal,
    }
  );

  const data = await handleResponse(response);

  if (!data?.id) {
    throw new Error("Conversation ID nahi mili");
  }

  return data as Conversation;
}

// =====================================================
// GET MESSAGES
// =====================================================

export async function getMessages(
  token: string,
  conversationId: number | string,
  signal?: AbortSignal
): Promise<Message[]> {
  const response = await fetch(
    `${API_URL}/chat/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal,
      cache: "no-store",
    }
  );

  const data = await handleResponse(response);

  if (!Array.isArray(data)) return [];

  return data
    .map(normalizeMessage)
    .filter(
      (item): item is Message => item !== null
    );
}

// =====================================================
// WEBSOCKET
// =====================================================

export function createChatSocket(
  token: string,
  onMessage: (data: WebSocketMessage) => void,
  onConnectionChange: (connected: boolean) => void
): WebSocket {
  const socket = new WebSocket(
    `${WS_URL}/chat/ws/${encodeURIComponent(token)}`
  );

  let connectionReported = false;

  socket.onopen = () => {
    if (connectionReported) return;

    connectionReported = true;
    onConnectionChange(true);
  };

  socket.onmessage = (event: MessageEvent<string>) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      onMessage(data);
    } catch (error) {
      console.error("WebSocket JSON error:", error);
    }
  };

  socket.onerror = (error) => {
    // Error ke baad browser normally onclose bhi fire karta hai.
    // Reconnect handling onclose mein hogi.
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    if (connectionReported) {
      connectionReported = false;
    }

    onConnectionChange(false);
  };

  return socket;
}

// =====================================================
// SEND MESSAGE
// =====================================================

export function sendSocketMessage(
  socket: WebSocket,
  receiverId: number | string,
  message: string
): void {
  if (socket.readyState !== WebSocket.OPEN) {
    throw new Error("WebSocket connected nahi hai");
  }

  socket.send(
    JSON.stringify({
      receiver_id: Number(receiverId),
      message,
    })
  );
}