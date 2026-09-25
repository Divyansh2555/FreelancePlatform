"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

const API_URL = "http://127.0.0.1:8000";
const WS_URL = "ws://127.0.0.1:8000";

// =========================================================
// TYPES
// =========================================================

interface User {
  id: number | string;
  name: string;
  role?: string | null;
  email?: string | null;
  avatar?: string | null;
}

interface Conversation {
  id: number | string;
  [key: string]: unknown;
}

interface Message {
  id: number | string | null;
  conversation_id: number | string | null;
  sender_id: number | string | null;
  receiver_id: number | string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface WebSocketMessage {
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

interface ApiError {
  detail?: string;
  message?: string;
}

interface JwtPayload {
  sub?: string | number;
  [key: string]: unknown;
}

// =========================================================
// HELPERS
// =========================================================

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (typeof value.id === "number" ||
      typeof value.id === "string") &&
    typeof value.name === "string"
  );
}

function normalizeMessage(value: unknown): Message | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    typeof value.id === "number" || typeof value.id === "string"
      ? value.id
      : null;

  const conversationId =
    typeof value.conversation_id === "number" ||
    typeof value.conversation_id === "string"
      ? value.conversation_id
      : null;

  const senderId =
    typeof value.sender_id === "number" ||
    typeof value.sender_id === "string"
      ? value.sender_id
      : null;

  const receiverId =
    typeof value.receiver_id === "number" ||
    typeof value.receiver_id === "string"
      ? value.receiver_id
      : null;

  const message =
    typeof value.message === "string"
      ? value.message
      : typeof value.content === "string"
        ? value.content
        : "";

  const createdAt =
    typeof value.created_at === "string"
      ? value.created_at
      : typeof value.createdAt === "string"
        ? value.createdAt
        : new Date().toISOString();

  const isRead =
    typeof value.is_read === "boolean" ? value.is_read : false;

  return {
    id,
    conversation_id: conversationId,
    sender_id: senderId,
    receiver_id: receiverId,
    message,
    is_read: isRead,
    created_at: createdAt,
  };
}

// =========================================================
// COMPONENT
// =========================================================

export default function MessagesPage() {
  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);

  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  // =========================================================
  // REFS
  // =========================================================

  const socketRef = useRef<WebSocket | null>(null);

  const reconnectTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const conversationRef = useRef<Conversation | null>(null);

  const mountedRef = useRef(false);

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = useCallback((): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("access_token");
  }, []);

  // =========================================================
  // CURRENT USER ID
  // =========================================================

  const getCurrentUserId = useCallback((): number | null => {
    const token = getToken();

    if (!token || typeof window === "undefined") {
      return null;
    }

    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        return null;
      }

      const base64 = parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const paddedBase64 =
        base64 +
        "=".repeat((4 - (base64.length % 4)) % 4);

      const payload = JSON.parse(
        window.atob(paddedBase64)
      ) as JwtPayload;

      if (payload?.sub === undefined || payload?.sub === null) {
        return null;
      }

      const userId = Number(payload.sub);

      return Number.isFinite(userId) ? userId : null;
    } catch (error: unknown) {
      console.error("JWT decode error:", error);
      return null;
    }
  }, [getToken]);

  const currentUserId = getCurrentUserId();

  // =========================================================
  // SEARCH USERS
  // =========================================================

  const searchUsers = useCallback(
    async (value = ""): Promise<void> => {
      const token = getToken();

      if (!token) {
        setUsers([]);
        return;
      }

      try {
        setUsersLoading(true);

        const response = await fetch(
          `${API_URL}/chat/users?search=${encodeURIComponent(value)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data: unknown = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          const errorData = isRecord(data)
            ? (data as ApiError)
            : null;

          throw new Error(
            errorData?.detail ||
              errorData?.message ||
              "Users load nahi hue"
          );
        }

        if (Array.isArray(data)) {
          setUsers(data.filter(isUser));
        } else {
          setUsers([]);
        }
      } catch (error: unknown) {
        console.error("Users error:", error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    },
    [getToken]
  );

  // =========================================================
  // INITIAL USERS
  // =========================================================

  useEffect(() => {
    void searchUsers("");
  }, [searchUsers]);

  // =========================================================
  // SEARCH DEBOUNCE
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      void searchUsers(search);
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [search, searchUsers]);

  // =========================================================
  // WEBSOCKET
  // =========================================================

  useEffect(() => {
    mountedRef.current = true;

    let reconnectAttempts = 0;

    const connect = (): void => {
      if (!mountedRef.current) {
        return;
      }

      const token = getToken();

      if (!token) {
        console.error("JWT token nahi mila");
        setConnected(false);
        return;
      }

      const existingSocket = socketRef.current;

      if (
        existingSocket &&
        (existingSocket.readyState === WebSocket.OPEN ||
          existingSocket.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      console.log("Connecting WebSocket...");

      const ws = new WebSocket(
        `${WS_URL}/chat/ws/${encodeURIComponent(token)}`
      );

      socketRef.current = ws;

      // =====================================================
      // OPEN
      // =====================================================

      ws.onopen = (): void => {
        if (!mountedRef.current) {
          return;
        }

        console.log("WebSocket connected");

        reconnectAttempts = 0;
        setConnected(true);
      };

      // =====================================================
      // MESSAGE
      // =====================================================

      ws.onmessage = (event: MessageEvent<string>): void => {
        if (!mountedRef.current) {
          return;
        }

        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          console.log("WS RECEIVED:", data);

          // =================================================
          // NEW MESSAGE
          // =================================================

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

            const activeConversation =
              conversationRef.current;

            if (
              activeConversation?.id &&
              newMessage.conversation_id &&
              Number(newMessage.conversation_id) !==
                Number(activeConversation.id)
            ) {
              console.log(
                "Different conversation - ignored"
              );

              return;
            }

            setMessages((previousMessages) => {
              const alreadyExists =
                previousMessages.some((oldMessage) => {
                  if (
                    newMessage.id != null &&
                    oldMessage.id != null
                  ) {
                    return (
                      Number(oldMessage.id) ===
                      Number(newMessage.id)
                    );
                  }

                  return (
                    oldMessage.message ===
                      newMessage.message &&
                    Number(oldMessage.sender_id) ===
                      Number(newMessage.sender_id) &&
                    oldMessage.created_at ===
                      newMessage.created_at
                  );
                });

              if (alreadyExists) {
                return previousMessages;
              }

              return [...previousMessages, newMessage];
            });
          }

          // =================================================
          // MESSAGE READ
          // =================================================

          if (
            data.type === "message_read" ||
            data.type === "read"
          ) {
            const messageId =
              data.message_id ??
              data.id ??
              null;

            if (messageId != null) {
              setMessages((previousMessages) =>
                previousMessages.map((item) =>
                  Number(item.id) === Number(messageId)
                    ? {
                        ...item,
                        is_read: true,
                      }
                    : item
                )
              );
            }
          }

          // =================================================
          // ERROR
          // =================================================

          if (data.type === "error") {
            console.error(
              "Chat server error:",
              data.message
            );
          }
        } catch (error: unknown) {
          console.error(
            "WebSocket JSON error:",
            error
          );
        }
      };

      // =====================================================
      // ERROR
      // =====================================================

      ws.onerror = (error: Event): void => {
        console.error("WebSocket error:", error);

        if (mountedRef.current) {
          setConnected(false);
        }
      };

      // =====================================================
      // CLOSE
      // =====================================================

      ws.onclose = (event: CloseEvent): void => {
        console.log(
          "WebSocket closed:",
          event.code,
          event.reason
        );

        if (!mountedRef.current) {
          return;
        }

        setConnected(false);

        reconnectAttempts += 1;

        const delay = Math.min(
          1000 * 2 ** (reconnectAttempts - 1),
          10000
        );

        console.log(
          `Reconnecting in ${delay}ms...`
        );

        if (reconnectTimerRef.current) {
          clearTimeout(
            reconnectTimerRef.current
          );
        }

        reconnectTimerRef.current =
          setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, delay);
      };
    };

    connect();

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      mountedRef.current = false;

      if (reconnectTimerRef.current) {
        clearTimeout(
          reconnectTimerRef.current
        );

        reconnectTimerRef.current = null;
      }

      const socket = socketRef.current;

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

        socketRef.current = null;
      }

      setConnected(false);
    };
  }, [getToken]);

  // =========================================================
  // OPEN CHAT
  // =========================================================

  const openChat = async (user: User): Promise<void> => {
    if (!user?.id) {
      return;
    }

    const token = getToken();

    if (!token) {
      alert("JWT token nahi mila");
      return;
    }

    try {
      setLoading(true);

      setSelectedUser(user);
      setMessages([]);
      setConversation(null);

      conversationRef.current = null;

      // =====================================================
      // CREATE / GET CONVERSATION
      // =====================================================

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
            user_id: Number(user.id),
          }),
        }
      );

      const conversationData: unknown =
        await response.json().catch(() => null);

      if (!response.ok) {
        const errorData = isRecord(conversationData)
          ? (conversationData as ApiError)
          : null;

        throw new Error(
          errorData?.detail ||
            errorData?.message ||
            "Conversation create nahi hui"
        );
      }

      if (
        !isRecord(conversationData) ||
        conversationData.id === undefined ||
        conversationData.id === null
      ) {
        throw new Error(
          "Backend ne conversation ID nahi bheji"
        );
      }

      const normalizedConversation: Conversation = {
        id: conversationData.id as number | string,
        ...conversationData,
      };

      setConversation(normalizedConversation);

      conversationRef.current =
        normalizedConversation;

      // =====================================================
      // LOAD OLD MESSAGES
      // =====================================================

      const messageResponse = await fetch(
        `${API_URL}/chat/${normalizedConversation.id}/messages`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const oldMessagesData: unknown =
        await messageResponse
          .json()
          .catch(() => null);

      if (!messageResponse.ok) {
        const errorData = isRecord(oldMessagesData)
          ? (oldMessagesData as ApiError)
          : null;

        throw new Error(
          errorData?.detail ||
            errorData?.message ||
            "Messages load nahi hue"
        );
      }

      const normalizedMessages: Message[] =
        Array.isArray(oldMessagesData)
          ? oldMessagesData
              .map(normalizeMessage)
              .filter(
                (item): item is Message =>
                  item !== null
              )
          : [];

      // =====================================================
      // MERGE OLD + WS MESSAGE
      // =====================================================

      setMessages((currentMessages) => {
        const merged = [
          ...normalizedMessages,
          ...currentMessages,
        ];

        const unique: Message[] = [];
        const ids = new Set<string>();

        for (const item of merged) {
          if (item?.id != null) {
            const id = String(item.id);

            if (ids.has(id)) {
              continue;
            }

            ids.add(id);
          }

          unique.push(item);
        }

        return unique;
      });
    } catch (error: unknown) {
      console.error("Open chat error:", error);

      conversationRef.current = null;

      setSelectedUser(null);
      setConversation(null);
      setMessages([]);

      alert(
        getErrorMessage(error) ||
          "Chat open nahi hui"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = (): void => {
    const text = message.trim();

    if (!text) {
      return;
    }

    if (!selectedUser) {
      alert("Pehle user select karo");
      return;
    }

    if (!conversation?.id) {
      alert("Conversation open nahi hai");
      return;
    }

    const socket = socketRef.current;

    if (!socket) {
      alert("WebSocket available nahi hai");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      alert("Chat server connected nahi hai");
      return;
    }

    try {
      const payload = {
        receiver_id: Number(selectedUser.id),
        message: text,
      };

      console.log("WS SEND:", payload);

      socket.send(JSON.stringify(payload));

      setMessage("");
    } catch (error: unknown) {
      console.error("Send message error:", error);

      alert("Message send nahi hua");
    }
  };

  // =========================================================
  // KEYBOARD
  // =========================================================

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // =========================================================
  // CLOSE CHAT
  // =========================================================

  const closeChat = (): void => {
    setSelectedUser(null);
    setConversation(null);
    setMessages([]);
    setMessage("");

    conversationRef.current = null;
  };

  // =========================================================
  // TIME
  // =========================================================

  const formatTime = (
    date: string | null | undefined
  ): string => {
    if (!date) {
      return "";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // INITIAL
  // =========================================================

  const getInitial = (name = ""): string => {
    const value = String(name).trim();

    return value
      ? value.charAt(0).toUpperCase()
      : "?";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f7f8fa] text-gray-900">
      <div className="flex h-full">

        {/* =================================================
            SIDEBAR
        ================================================== */}

        <aside
          className={`
            flex w-full flex-col
            border-r border-gray-200
            bg-white
            md:w-[360px]
            lg:w-[390px]
            md:shrink-0
            ${
              selectedUser
                ? "hidden md:flex"
                : "flex"
            }
          `}
        >
          {/* HEADER */}

          <div className="border-b border-gray-100 bg-white px-5 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
                  Messages
                </h1>

                <p className="mt-0.5 text-xs text-gray-400">
                  Connect and chat instantly
                </p>
              </div>

              {/* CONNECTION */}

              <div
                className={`
                  flex items-center gap-2
                  rounded-full
                  border px-3 py-1.5
                  text-xs font-medium
                  ${
                    connected
                      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                      : "border-red-100 bg-red-50 text-red-500"
                  }
                `}
              >
                <span
                  className={`
                    h-2 w-2 rounded-full
                    ${
                      connected
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }
                  `}
                />

                {connected ? "Online" : "Offline"}
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative mt-5">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(
                  event: ChangeEvent<HTMLInputElement>
                ) => setSearch(event.target.value)}
                placeholder="Search people..."
                className="
                  h-11 w-full
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  pl-10 pr-4
                  text-sm text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-emerald-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-emerald-50
                "
              />
            </div>
          </div>

          {/* USER LIST */}

          <div className="flex-1 overflow-y-auto">
            {usersLoading ? (
              <div className="flex h-full items-center justify-center">
                <div
                  className="
                    h-7 w-7
                    animate-spin
                    rounded-full
                    border-2
                    border-gray-200
                    border-t-emerald-500
                  "
                />
              </div>
            ) : users.length === 0 ? (
              <div
                className="
                  flex h-full
                  flex-col
                  items-center
                  justify-center
                  px-8
                  text-center
                "
              >
                <div
                  className="
                    flex h-16 w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gray-100
                    text-2xl
                  "
                >
                  👥
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-700">
                  No users found
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Try searching with another name
                </p>
              </div>
            ) : (
              users.map((user: User) => {
                const active =
                  Number(selectedUser?.id) ===
                  Number(user.id);

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => void openChat(user)}
                    disabled={loading}
                    className={`
                      group flex w-full
                      items-center gap-3
                      border-b border-gray-100
                      px-4 py-3.5
                      text-left
                      transition-all
                      disabled:cursor-wait
                      ${
                        active
                          ? "bg-emerald-50/70"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >
                    {/* AVATAR */}

                    <div className="relative shrink-0">
                      <div
                        className={`
                          flex h-12 w-12
                          items-center
                          justify-center
                          rounded-full
                          text-base font-bold
                          ${
                            active
                              ? "bg-emerald-500 text-white"
                              : "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600"
                          }
                        `}
                      >
                        {getInitial(user.name)}
                      </div>

                      <span
                        className="
                          absolute
                          bottom-0 right-0
                          h-3 w-3
                          rounded-full
                          border-2 border-white
                          bg-emerald-500
                        "
                      />
                    </div>

                    {/* USER INFO */}

                    <div className="min-w-0 flex-1">
                      <h2
                        className={`
                          truncate
                          text-[14px]
                          font-semibold
                          ${
                            active
                              ? "text-emerald-700"
                              : "text-gray-800"
                          }
                        `}
                      >
                        {user.name}
                      </h2>

                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-gray-400
                        "
                      >
                        {user.role || "Available to chat"}
                      </p>
                    </div>

                    {/* ARROW */}

                    <svg
                      className={`
                        h-4 w-4 shrink-0
                        ${
                          active
                            ? "text-emerald-500"
                            : "text-gray-300"
                        }
                      `}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 18 6-6-6-6"
                      />
                    </svg>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* =================================================
            CHAT AREA
        ================================================== */}

        <main
          className={`
            flex flex-1 flex-col
            ${
              selectedUser
                ? "flex"
                : "hidden md:flex"
            }
          `}
        >
          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {!selectedUser ? (
            <div
              className="
                relative
                flex flex-1
                items-center
                justify-center
                overflow-hidden
                bg-[#f8fafb]
              "
            >
              <div
                className="
                  absolute
                  -left-24
                  -top-24
                  h-72 w-72
                  rounded-full
                  bg-emerald-100/40
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -bottom-24
                  -right-24
                  h-72 w-72
                  rounded-full
                  bg-indigo-100/40
                  blur-3xl
                "
              />

              <div className="relative z-10 px-6 text-center">
                <div
                  className="
                    mx-auto
                    flex h-24 w-24
                    items-center
                    justify-center
                    rounded-[28px]
                    bg-gradient-to-br
                    from-emerald-400
                    to-emerald-600
                    text-4xl
                    text-white
                    shadow-xl
                    shadow-emerald-200
                  "
                >
                  💬
                </div>

                <h2
                  className="
                    mt-7
                    text-3xl
                    font-bold
                    tracking-tight
                    text-gray-800
                  "
                >
                  Your messages
                </h2>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-gray-400
                  "
                >
                  Select someone from the sidebar
                  to start a private conversation.
                </p>

                <div
                  className="
                    mx-auto mt-6
                    inline-flex
                    items-center gap-2
                    rounded-full
                    bg-white
                    px-4 py-2
                    text-xs font-medium
                    text-gray-500
                    shadow-sm
                    ring-1 ring-gray-100
                  "
                >
                  <span className="text-emerald-500">
                    ●
                  </span>

                  Real-time messaging enabled
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* =================================================
                  CHAT HEADER
              ================================================== */}

              <header
                className="
                  flex h-[70px]
                  shrink-0
                  items-center gap-3
                  border-b border-gray-200
                  bg-white
                  px-3
                  shadow-sm
                  sm:px-5
                "
              >
                {/* BACK */}

                <button
                  type="button"
                  onClick={closeChat}
                  className="
                    flex h-9 w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    md:hidden
                  "
                  aria-label="Back"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19 8 12l7-7"
                    />
                  </svg>
                </button>

                {/* AVATAR */}

                <div
                  className="
                    flex h-11 w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-indigo-100
                    to-purple-100
                    font-bold
                    text-indigo-600
                  "
                >
                  {getInitial(selectedUser.name)}
                </div>

                {/* USER INFO */}

                <div className="min-w-0 flex-1">
                  <h2
                    className="
                      truncate
                      text-[15px]
                      font-semibold
                      text-gray-900
                    "
                  >
                    {selectedUser.name}
                  </h2>

                  <div
                    className="
                      mt-0.5
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <span
                      className={`
                        h-1.5 w-1.5
                        rounded-full
                        ${
                          connected
                            ? "bg-emerald-500"
                            : "bg-red-400"
                        }
                      `}
                    />

                    <p className="text-xs text-gray-400">
                      {connected
                        ? "Online"
                        : "Connecting..."}
                    </p>
                  </div>
                </div>

                {/* MORE */}

                <button
                  type="button"
                  className="
                    flex h-9 w-9
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    transition
                    hover:bg-gray-100
                  "
                  aria-label="More"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                  </svg>
                </button>
              </header>

              {/* =================================================
                  MESSAGES
              ================================================== */}

              <section
                className="
                  relative
                  flex-1
                  overflow-y-auto
                  px-3 py-5
                  sm:px-6
                  sm:py-6
                "
                style={{
                  backgroundColor: "#f5f7f6",
                  backgroundImage:
                    "radial-gradient(rgba(0,0,0,.035) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                <div
                  className="
                    mx-auto
                    flex
                    max-w-4xl
                    flex-col
                    gap-2
                  "
                >
                  {/* SECURITY */}

                  <div className="mb-4 flex justify-center">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-amber-50
                        px-3.5 py-2
                        text-[11px]
                        font-medium
                        text-amber-700
                        shadow-sm
                        ring-1
                        ring-amber-100
                      "
                    >
                      🔒 Messages are private and secure
                    </div>
                  </div>

                  {/* EMPTY CHAT */}

                  {messages.length === 0 && (
                    <div className="my-16 text-center">
                      <div
                        className="
                          mx-auto
                          flex h-14 w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-white
                          text-xl
                          shadow-sm
                        "
                      >
                        👋
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-medium
                          text-gray-500
                        "
                      >
                        Say hello to {selectedUser.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Start your conversation below
                      </p>
                    </div>
                  )}

                  {/* MESSAGE LIST */}

                  {messages.map(
                    (item: Message, index: number) => {
                      const isMine =
                        Number(item.sender_id) ===
                        Number(currentUserId);

                      return (
                        <div
                          key={
                            item.id ??
                            `${item.created_at}-${index}`
                          }
                          className={`
                            flex w-full
                            ${
                              isMine
                                ? "justify-end"
                                : "justify-start"
                            }
                          `}
                        >
                          <div
                            className={`
                              relative
                              max-w-[88%]
                              rounded-2xl
                              px-3.5 py-2.5
                              shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                              sm:max-w-[68%]
                              ${
                                isMine
                                  ? "rounded-br-md bg-[#d9fdd3] text-gray-800"
                                  : "rounded-bl-md bg-white text-gray-800"
                              }
                            `}
                          >
                            <p
                              className="
                                whitespace-pre-wrap
                                break-words
                                pr-14
                                text-[14px]
                                leading-[1.45]
                              "
                            >
                              {item.message}
                            </p>

                            <div
                              className="
                                absolute
                                bottom-1.5
                                right-2.5
                                flex
                                items-center
                                gap-1
                              "
                            >
                              <span
                                className="
                                  text-[10px]
                                  font-medium
                                  text-gray-400
                                "
                              >
                                {formatTime(
                                  item.created_at
                                )}
                              </span>

                              {isMine && (
                                <span
                                  className={`
                                    text-[13px]
                                    leading-none
                                    ${
                                      item.is_read
                                        ? "text-sky-500"
                                        : "text-gray-400"
                                    }
                                  `}
                                >
                                  {item.is_read
                                    ? "✓✓"
                                    : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  <div
                    ref={messagesEndRef}
                    className="h-1"
                  />
                </div>
              </section>

              {/* =================================================
                  INPUT
              ================================================== */}

              <footer
                className="
                  shrink-0
                  border-t
                  border-gray-200
                  bg-white
                  px-2.5
                  py-2.5
                  sm:px-5
                  sm:py-3
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    max-w-4xl
                    items-end
                    gap-2
                  "
                >
                  {/* EMOJI */}

                  <button
                    type="button"
                    onClick={() =>
                      setMessage((previous) =>
                        previous
                          ? `${previous} 😊`
                          : "😊"
                      )
                    }
                    className="
                      hidden
                      h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-xl
                      transition
                      hover:bg-gray-100
                      sm:flex
                    "
                    aria-label="Add emoji"
                  >
                    😊
                  </button>

                  {/* TEXTAREA */}

                  <div
                    className="
                      flex
                      flex-1
                      items-end
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-1.5
                      transition
                      focus-within:border-emerald-300
                      focus-within:bg-white
                      focus-within:ring-4
                      focus-within:ring-emerald-50
                    "
                  >
                    <textarea
                      value={message}
                      onChange={(
                        event: ChangeEvent<HTMLTextAreaElement>
                      ) =>
                        setMessage(
                          event.target.value
                        )
                      }
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message..."
                      rows={1}
                      className="
                        max-h-32
                        min-h-10
                        flex-1
                        resize-none
                        border-0
                        bg-transparent
                        px-3
                        py-2.5
                        text-sm
                        leading-5
                        text-gray-800
                        outline-none
                        placeholder:text-gray-400
                      "
                    />
                  </div>

                  {/* SEND */}

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      !message.trim() ||
                      !connected ||
                      !conversation?.id
                    }
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-500
                      text-white
                      shadow-sm
                      transition-all
                      hover:bg-emerald-600
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:bg-gray-300
                      disabled:shadow-none
                    "
                    aria-label="Send message"
                  >
                    <svg
                      className="ml-0.5 h-[18px] w-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m22 2-7 20-4-9-9-4Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2 11 13"
                      />
                    </svg>
                  </button>
                </div>

                <p
                  className="
                    mx-auto
                    mt-1.5
                    hidden
                    max-w-4xl
                    text-[10px]
                    text-gray-400
                    sm:block
                  "
                >
                  Press Enter to send · Shift + Enter for a new line
                </p>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
