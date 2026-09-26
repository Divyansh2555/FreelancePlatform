import type {
  User,
  Conversation,
  Message,
} from "../../types/chat";

const USERS_KEY = "chat_users";
const CONVERSATIONS_KEY = "chat_conversations";
const MESSAGES_KEY = "chat_messages";

// =====================================================
// USERS
// =====================================================

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

export function getCachedUsers(): User[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(USERS_KEY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// =====================================================
// CONVERSATIONS
// =====================================================

export function saveConversation(
  userId: number | string,
  conversation: Conversation
): void {
  if (typeof window === "undefined") return;

  try {
    const data = localStorage.getItem(
      CONVERSATIONS_KEY
    );

    const conversations = data
      ? JSON.parse(data)
      : {};

    conversations[String(userId)] = conversation;

    localStorage.setItem(
      CONVERSATIONS_KEY,
      JSON.stringify(conversations)
    );
  } catch (error) {
    console.error(
      "Save conversation cache error:",
      error
    );
  }
}

export function getCachedConversation(
  userId: number | string
): Conversation | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const data = localStorage.getItem(
      CONVERSATIONS_KEY
    );

    if (!data) return null;

    const conversations = JSON.parse(data);

    return conversations[String(userId)] || null;
  } catch {
    return null;
  }
}

// =====================================================
// MESSAGES
// =====================================================

export function saveMessages(
  conversationId: number | string,
  messages: Message[]
): void {
  if (typeof window === "undefined") return;

  try {
    const data = localStorage.getItem(
      MESSAGES_KEY
    );

    const allMessages = data
      ? JSON.parse(data)
      : {};

    allMessages[String(conversationId)] =
      messages;

    localStorage.setItem(
      MESSAGES_KEY,
      JSON.stringify(allMessages)
    );
  } catch (error) {
    console.error(
      "Save messages cache error:",
      error
    );
  }
}

export function getCachedMessages(
  conversationId: number | string
): Message[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(
      MESSAGES_KEY
    );

    if (!data) return [];

    const allMessages = JSON.parse(data);

    const messages =
      allMessages[String(conversationId)];

    return Array.isArray(messages)
      ? messages
      : [];
  } catch {
    return [];
  }
}

// =====================================================
// CLEAR
// =====================================================

export function clearChatCache(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(
    CONVERSATIONS_KEY
  );
  localStorage.removeItem(MESSAGES_KEY);
}