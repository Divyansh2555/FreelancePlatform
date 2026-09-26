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
  conversation_id: number | string | null;
  sender_id: number | string | null;
  receiver_id: number | string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WebSocketMessage {
  type?: string;

  message_id?: number | string | null;
  id?: number | string | null;

  conversation_id?: number | string | null;
  conversationId?: number | string | null;

  sender_id?: number | string | null;
  senderId?: number | string | null;

  receiver_id?: number | string | null;
  receiverId?: number | string | null;

  message?: string;
  content?: string;

  is_read?: boolean;

  created_at?: string;
  createdAt?: string;

  detail?: string;
}