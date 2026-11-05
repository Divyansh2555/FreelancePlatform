"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    User,
    Conversation,
    Message,
    ChatCache,
    WebSocketMessage,
} from "../../types/freelamcers/chat";

import {
    getUsers,
    getConversation,
    getMessages,
    createChatSocket,
    sendSocketMessage,
} from "../../lib/api/services/freelancer/chat";

import {
    getToken,
    getCurrentUserId,
    mergeMessages,
} from "../../lib/utils/chat";

// ===================================================
// GLOBAL USERS CACHE
// Component remount hone par bhi cache available rahega
// ===================================================

const usersCache = new Map<
    string,
    {
        data: User[];
        time: number;
    }
>();

const USERS_CACHE_TIME = 30 * 1000;

// ===================================================
// HOOK
// ===================================================

export function useChat() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const [conversation, setConversation] =
        useState<Conversation | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");

    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);

    const currentUserId = getCurrentUserId();

    // ===================================================
    // REFS
    // ===================================================

    const socketRef = useRef<WebSocket | null>(null);

    const cacheRef = useRef<Map<string, ChatCache>>(
        new Map()
    );

    const openingRef = useRef<string | null>(null);

    const activeUserRef = useRef<string | null>(null);

    const conversationRef = useRef<Conversation | null>(null);

    const requestIdRef = useRef(0);

    const searchIdRef = useRef(0);

    const messageRef = useRef("");

    const mountedRef = useRef(false);

    const reconnectTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    // ===================================================
    // MESSAGE SYNC
    // ===================================================

    useEffect(() => {
        messageRef.current = message;
    }, [message]);

    // ===================================================
    // SEARCH USERS
    // ===================================================

    useEffect(() => {
        const token = getToken();

        if (!token) return;

        let cancelled = false;

        const controller = new AbortController();

        const cacheKey = search.trim().toLowerCase();

        const timer = setTimeout(async () => {
            const requestId = ++searchIdRef.current;

            // Check cache
            const cached = usersCache.get(cacheKey);

            if (
                cached &&
                Date.now() - cached.time < USERS_CACHE_TIME
            ) {
                setUsers(cached.data);
                setUsersLoading(false);
                return;
            }

            try {
                setUsersLoading(true);

                const data = await getUsers(
                    token,
                    search,
                    controller.signal
                );

                if (
                    cancelled ||
                    controller.signal.aborted ||
                    requestId !== searchIdRef.current
                ) {
                    return;
                }

                setUsers(data);

                usersCache.set(cacheKey, {
                    data,
                    time: Date.now(),
                });
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Users error:", error);
                }
            } finally {
                if (
                    !cancelled &&
                    requestId === searchIdRef.current
                ) {
                    setUsersLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            controller.abort();
        };
    }, [search]);

    // ===================================================
    // CACHE UPDATE
    // ===================================================

    const updateCache = useCallback(
        (userId: string, newMessages: Message[]) => {
            const cached = cacheRef.current.get(userId);

            if (!cached) return;

            cacheRef.current.set(userId, {
                ...cached,
                messages: mergeMessages(
                    cached.messages,
                    newMessages
                ),
            });
        },
        []
    );

    // ===================================================
    // WEBSOCKET
    // ===================================================

    useEffect(() => {
        mountedRef.current = true;

        let stopped = false;
        let attempts = 0;

        let connectionTimer: ReturnType<
            typeof setTimeout
        > | null = null;

        const connect = () => {
            if (stopped || !mountedRef.current) return;

            const token = getToken();

            if (!token) return;

            const existing = socketRef.current;

            if (
                existing &&
                (
                    existing.readyState === WebSocket.OPEN ||
                    existing.readyState === WebSocket.CONNECTING
                )
            ) {
                return;
            }

            const socket = createChatSocket(
                token,

                (data: WebSocketMessage) => {
                    if (stopped || !mountedRef.current) return;

                    // -------------------------------------------
                    // NEW MESSAGE
                    // -------------------------------------------

                    if (data.type === "message") {
                        const newMessage: Message = {
                            id: data.message_id ?? data.id ?? null,

                            conversation_id:
                                data.conversation_id ??
                                data.conversationId ??
                                null,

                            sender_id:
                                data.sender_id ??
                                data.senderId ??
                                null,

                            receiver_id:
                                data.receiver_id ??
                                data.receiverId ??
                                null,

                            message:
                                data.message ??
                                data.content ??
                                "",

                            is_read: data.is_read ?? false,

                            created_at:
                                data.created_at ??
                                data.createdAt ??
                                new Date().toISOString(),
                        };

                        const active = conversationRef.current;

                        if (
                            !active ||
                            Number(active.id) !==
                            Number(newMessage.conversation_id)
                        ) {
                            return;
                        }

                        setMessages((previous) => {
                            const merged = mergeMessages(
                                previous,
                                [newMessage]
                            );

                            const userId = activeUserRef.current;

                            if (userId) {
                                updateCache(userId, [newMessage]);
                            }

                            return merged;
                        });
                    }

                    // -------------------------------------------
                    // MESSAGE READ
                    // -------------------------------------------

                    if (
                        data.type === "message_read" ||
                        data.type === "read"
                    ) {
                        const id = data.message_id ?? data.id;

                        if (id == null) return;

                        setMessages((previous) => {
                            const updated = previous.map((item) =>
                                Number(item.id) === Number(id)
                                    ? { ...item, is_read: true }
                                    : item
                            );

                            const userId = activeUserRef.current;

                            const cached = userId
                                ? cacheRef.current.get(userId)
                                : null;

                            if (userId && cached) {
                                cacheRef.current.set(userId, {
                                    ...cached,
                                    messages: updated,
                                });
                            }

                            return updated;
                        });
                    }
                },

                (status) => {
                    if (stopped || !mountedRef.current) return;

                    setConnected(status);

                    if (status) {
                        attempts = 0;
                        return;
                    }

                    // Reconnect only after connection closes
                    if (reconnectTimerRef.current) return;

                    attempts++;

                    const delay = Math.min(
                        1000 * 2 ** (attempts - 1),
                        10000
                    );

                    reconnectTimerRef.current = setTimeout(() => {
                        reconnectTimerRef.current = null;
                        connect();
                    }, delay);
                }
            );

            socketRef.current = socket;
        };

        // StrictMode first mount cleanup hone par
        // connection start nahi hoga.
        connectionTimer = setTimeout(connect, 100);

        return () => {
            stopped = true;
            mountedRef.current = false;

            if (connectionTimer) {
                clearTimeout(connectionTimer);
            }

            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }

            const socket = socketRef.current;

            socketRef.current = null;

            if (socket) {
                socket.onopen = null;
                socket.onmessage = null;
                socket.onerror = null;
                socket.onclose = null;

                if (
                    socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING
                ) {
                    socket.close();
                }
            }

            setConnected(false);
        };
    }, [updateCache]);

    // ===================================================
    // OPEN CHAT
    // ===================================================

    const openChat = useCallback(
        async (user: User) => {
            const userId = String(user.id);

            // Same user ki request already running hai
            if (openingRef.current === userId) return;

            // Already active chat ko dobara open mat karo
            if (
                activeUserRef.current === userId &&
                conversationRef.current
            ) {
                return;
            }

            const token = getToken();

            if (!token) {
                alert("JWT token nahi mila");
                return;
            }

            const requestId = ++requestIdRef.current;

            openingRef.current = userId;
            activeUserRef.current = userId;

            setSelectedUser(user);
            setMessages([]);
            setMessage("");
            setConversation(null);

            conversationRef.current = null;

            setLoading(true);

            try {
                // -------------------------------------------
                // CHECK CHAT CACHE
                // -------------------------------------------

                const cached = cacheRef.current.get(userId);

                if (cached) {
                    if (requestId !== requestIdRef.current) return;

                    setConversation(cached.conversation);

                    conversationRef.current = cached.conversation;

                    setMessages(cached.messages);

                    return;
                }

                // -------------------------------------------
                // GET CONVERSATION
                // -------------------------------------------

                const conversationData = await getConversation(
                    token,
                    user.id
                );

                if (requestId !== requestIdRef.current) return;

                setConversation(conversationData);

                conversationRef.current = conversationData;

                // -------------------------------------------
                // GET MESSAGES
                // -------------------------------------------

                const oldMessages = await getMessages(
                    token,
                    conversationData.id
                );

                if (requestId !== requestIdRef.current) return;

                setMessages((current) => {
                    const merged = mergeMessages(
                        oldMessages,
                        current
                    );

                    cacheRef.current.set(userId, {
                        conversation: conversationData,
                        messages: merged,
                    });

                    return merged;
                });
            } catch (error) {
                if (requestId !== requestIdRef.current) return;

                console.error("Open chat error:", error);

                setSelectedUser(null);
                setConversation(null);
                setMessages([]);

                conversationRef.current = null;
                activeUserRef.current = null;

                alert(
                    error instanceof Error
                        ? error.message
                        : "Chat open nahi hui"
                );
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoading(false);

                    if (openingRef.current === userId) {
                        openingRef.current = null;
                    }
                }
            }
        },
        []
    );

    // ===================================================
    // SEND MESSAGE
    // ===================================================

    const sendMessage = useCallback(() => {
        const text = messageRef.current.trim();

        if (!text) return;

        if (!selectedUser || !conversation) {
            alert("Pehle chat open karo");
            return;
        }

        const socket = socketRef.current;

        if (
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {
            alert("WebSocket connected nahi hai");
            return;
        }

        try {
            sendSocketMessage(
                socket,
                selectedUser.id,
                text
            );

            setMessage("");
        } catch (error) {
            console.error("Send message error:", error);
            alert("Message send nahi hua");
        }
    }, [selectedUser, conversation]);

    // ===================================================
    // CLOSE CHAT
    // ===================================================

    const closeChat = useCallback(() => {
        requestIdRef.current++;

        openingRef.current = null;
        activeUserRef.current = null;

        conversationRef.current = null;

        setSelectedUser(null);
        setConversation(null);
        setMessages([]);
        setMessage("");
        setLoading(false);
    }, []);

    // ===================================================
    // RETURN
    // ===================================================

    return {
        users,
        search,
        setSearch,

        selectedUser,
        conversation,
        messages,

        message,
        setMessage,

        connected,
        loading,
        usersLoading,

        currentUserId,

        openChat,
        closeChat,
        sendMessage,
    };
}