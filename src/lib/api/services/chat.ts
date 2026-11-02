import { apiFetch } from "../client";
import { endpoints } from "../endpoints";

import type {
  User,
  Conversation,
  Message,
} from "../../../types/chat";

// ========================================
// SEARCH / GET ALL USERS
// ========================================

export const searchUsers = async (
  search: string
): Promise<User[]> => {
  const query = search.trim();

  const endpoint = query
    ? `${endpoints.chat.users}?search=${encodeURIComponent(query)}`
    : endpoints.chat.users;

  const data = await apiFetch<unknown>(endpoint);

  console.log("[CHAT] Users API Response:", data);

  if (Array.isArray(data)) {
    return data as User[];
  }

  if (typeof data === "object" && data !== null) {
    const response = data as {
      users?: User[];
      results?: User[];
      data?: User[] | { users?: User[]; results?: User[] };
    };

    if (Array.isArray(response.users)) {
      return response.users;
    }

    if (Array.isArray(response.results)) {
      return response.results;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data && !Array.isArray(response.data)) {
      if (Array.isArray(response.data.users)) {
        return response.data.users;
      }

      if (Array.isArray(response.data.results)) {
        return response.data.results;
      }
    }
  }

  console.warn("[CHAT] Unexpected users response:", data);

  return [];
};

// ========================================
// CREATE CONVERSATION
// ========================================

export const createConversation = async (
  userId: number | string
): Promise<Conversation> => {
  return apiFetch<Conversation>(
    endpoints.chat.conversation,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
      }),
    }
  );
};

// ========================================
// GET MESSAGES
// ========================================

export const getMessages = async (
  conversationId: number | string
): Promise<Message[]> => {
  const data = await apiFetch<unknown>(
    endpoints.chat.messages(conversationId)
  );

  console.log("[CHAT] Messages API Response:", data);

  if (Array.isArray(data)) {
    return data as Message[];
  }

  if (typeof data === "object" && data !== null) {
    const response = data as {
      messages?: Message[];
      results?: Message[];
      data?: Message[];
    };

    if (Array.isArray(response.messages)) {
      return response.messages;
    }

    if (Array.isArray(response.results)) {
      return response.results;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }
  }

  return [];
};