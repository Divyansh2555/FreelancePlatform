"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    searchUsers,
    createConversation,
    getMessages,
} from "../lib/api/services/chat";

import { endpoints } from "../lib/api/endpoints";

import type {
    User,
    Conversation,
    Message,
    WebSocketMessage,
} from "../types/chat";

// ========================================
// WEBSOCKET URL
// ========================================

const WS_BASE_URL =
    process.env.NEXT_PUBLIC_WS_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/^http/, "ws");

// ========================================
// RETURN TYPE
// ========================================

interface UseChatReturn {
    users: User[];
    messages: Message[];
    conversation: Conversation | null;

    loading: boolean;
    searching: boolean;
    connected: boolean;

    error: string | null;

    search: (value: string) => Promise<void>;
    openChat: (user: User) => Promise<void>;
    sendMessage: (message: string) => void;
    disconnect: () => void;
}

// ========================================
// MAIN HOOK
// ========================================

export function useChat(): UseChatReturn {
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const [conversation, setConversation] =
        useState<Conversation | null>(null);

    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [connected, setConnected] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);

    const reconnectTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeConversationRef =
        useRef<Conversation | null>(null);

    const reconnectAttemptsRef = useRef(0);

    const shouldReconnectRef = useRef(true);

    const searchRequestRef = useRef(0);

    const connectRef = useRef<() => void>(() => { });

    // ========================================
    // GET TOKEN
    // ========================================

    const getToken = useCallback((): string | null => {
        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem("access_token");
    }, []);

    // ========================================
    // NORMALIZE MESSAGE
    // ========================================

    const normalizeMessage = useCallback(
        (data: WebSocketMessage): Message | null => {
            const messageText = data.message ?? data.content;

            if (!messageText) {
                return null;
            }

            return {
                id: data.message_id ?? data.id ?? null,

                conversation_id:
                    data.conversation_id ??
                    data.conversationId ??
                    activeConversationRef.current?.id ??
                    null,

                sender_id: data.sender_id ?? data.senderId ?? null,

                receiver_id: data.receiver_id ?? data.receiverId ?? null,

                message: messageText,

                is_read: data.is_read ?? false,

                created_at:
                    data.created_at ??
                    data.createdAt ??
                    new Date().toISOString(),
            };
        },
        []
    );

    // ========================================
    // DISCONNECT WEBSOCKET
    // ========================================

    const disconnect = useCallback(() => {
        shouldReconnectRef.current = false;

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        const ws = wsRef.current;

        wsRef.current = null;

        if (ws) {
            ws.close();
        }

        setConnected(false);
    }, []);

    // ========================================
    // CONNECT WEBSOCKET
    // ========================================

    const connectWebSocket = useCallback(() => {
        const token = getToken();

        if (!token || !WS_BASE_URL) {
            setError("WebSocket URL or authentication token missing.");
            return;
        }

        if (
            wsRef.current &&
            (
                wsRef.current.readyState === WebSocket.OPEN ||
                wsRef.current.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        const baseUrl = WS_BASE_URL.replace(/\/+$/, "");

        const endpoint = endpoints.chat.websocket(token);

        const cleanEndpoint = endpoint.startsWith("/")
            ? endpoint
            : `/${endpoint}`;

        const wsUrl = `${baseUrl}${cleanEndpoint}`;

        console.log("[CHAT] WebSocket URL:", wsUrl);

        const ws = new WebSocket(wsUrl);

        wsRef.current = ws;

        ws.onopen = () => {
            if (wsRef.current !== ws) return;

            console.log("[CHAT] WebSocket connected");

            setConnected(true);
            setError(null);

            reconnectAttemptsRef.current = 0;
        };

        ws.onmessage = (event: MessageEvent) => {
            if (wsRef.current !== ws) return;

            try {
                const data = JSON.parse(
                    event.data
                ) as WebSocketMessage;

                const normalized = normalizeMessage(data);

                if (!normalized) return;

                setMessages((previous) => {
                    const exists = previous.some(
                        (item) =>
                            item.id !== null &&
                            item.id === normalized.id
                    );

                    if (exists) {
                        return previous;
                    }

                    return [...previous, normalized];
                });
            } catch (err) {
                console.error("[CHAT] WebSocket message error:", err);
            }
        };

        ws.onerror = () => {
            if (wsRef.current !== ws) return;

            setError("WebSocket connection error.");
        };

        ws.onclose = () => {
            if (wsRef.current !== ws) return;

            wsRef.current = null;

            setConnected(false);

            if (
                shouldReconnectRef.current &&
                reconnectAttemptsRef.current < 5
            ) {
                reconnectAttemptsRef.current++;

                reconnectTimerRef.current = setTimeout(() => {
                    connectRef.current();
                }, 2000);
            }
        };
    }, [getToken, normalizeMessage]);

    connectRef.current = connectWebSocket;

    // ========================================
    // SEARCH ALL USERS
    // ========================================

    const search = useCallback(async (value: string) => {
        const requestId = ++searchRequestRef.current;

        try {
            setSearching(true);
            setError(null);

            // Empty search par bhi all users API call hogi.
            const result = await searchUsers(value);

            // Ignore old requests.
            if (requestId !== searchRequestRef.current) {
                return;
            }

            console.log("[CHAT] Users loaded:", result);

            setUsers(result);
        } catch (err) {
            if (requestId !== searchRequestRef.current) {
                return;
            }

            console.error("[CHAT] User search error:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "User search failed."
            );

            setUsers([]);
        } finally {
            if (requestId === searchRequestRef.current) {
                setSearching(false);
            }
        }
    }, []);

    // ========================================
    // OPEN CHAT
    // ========================================

    const openChat = useCallback(
        async (user: User) => {
            try {
                setLoading(true);
                setError(null);

                disconnect();

                setMessages([]);
                setConversation(null);

                activeConversationRef.current = null;

                console.log("[CHAT] Opening user:", user.id);

                // Create conversation
                const conversationData = await createConversation(
                    user.id
                );

                setConversation(conversationData);

                activeConversationRef.current = conversationData;

                // Load old messages
                const oldMessages = await getMessages(
                    conversationData.id
                );

                setMessages(oldMessages);

                // Connect WebSocket
                shouldReconnectRef.current = true;

                reconnectAttemptsRef.current = 0;

                connectRef.current();
            } catch (err) {
                console.error("[CHAT] Open chat error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to open chat."
                );
            } finally {
                setLoading(false);
            }
        },
        [disconnect]
    );

    // ========================================
    // SEND MESSAGE
    // ========================================

    const sendMessage = useCallback((message: string) => {
        const text = message.trim();

        if (!text) return;

        const ws = wsRef.current;

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            setError("WebSocket is not connected.");
            return;
        }

        const activeConversation =
            activeConversationRef.current;

        if (!activeConversation) {
            setError("Please open a conversation first.");
            return;
        }

        ws.send(
            JSON.stringify({
                type: "message",
                conversation_id: activeConversation.id,
                message: text,
            })
        );
    }, []);

    // ========================================
    // CLEANUP
    // ========================================

    useEffect(() => {
        return () => {
            shouldReconnectRef.current = false;

            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }

            const ws = wsRef.current;

            wsRef.current = null;

            if (ws) {
                ws.close();
            }
        };
    }, []);

    // ========================================
    // RETURN
    // ========================================

    return {
        users,
        messages,
        conversation,

        loading,
        searching,
        connected,

        error,

        search,
        openChat,
        sendMessage,
        disconnect,
    };
}