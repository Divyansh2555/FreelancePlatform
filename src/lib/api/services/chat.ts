import {
  apiGet,
  apiPost,
} from "../client";

import { endpoints } from "../endpoints";

export interface User {
  id: number | string;
  name: string;
  role?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export interface Conversation {
  id: number | string;
  [key: string]: unknown;
}

export interface Message {
  id: number | string | null;
  conversation_id:
    | number
    | string
    | null;
  sender_id:
    | number
    | string
    | null;
  receiver_id:
    | number
    | string
    | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getChatUsers(
  search = ""
): Promise<User[]> {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  return apiGet<User[]>(
    `${endpoints.chat.users}${query}`
  );
}

export async function createConversation(
  userId: number | string
): Promise<Conversation> {
  return apiPost<Conversation>(
    endpoints.chat.conversation,
    {
      user_id: Number(userId),
    }
  );
}

export async function getMessages(
  conversationId: number | string
): Promise<Message[]> {
  return apiGet<Message[]>(
    endpoints.chat.messages(conversationId)
  );
}