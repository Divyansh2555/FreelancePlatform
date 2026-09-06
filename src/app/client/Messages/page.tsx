"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function MessagesPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  // =========================================================
  // CURRENT USER ID
  // =========================================================

  const getCurrentUserId = () => {
    const token = getToken();

    if (!token) return null;

    try {
      const payload = token.split(".")[1];

      const base64 = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const decoded = JSON.parse(window.atob(base64));

      return Number(decoded.sub);
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // =========================================================
  // SEARCH USERS
  // =========================================================

  const searchUsers = async (value = "") => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/chat/users?search=${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Users load nahi hue");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    searchUsers("");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================================================
  // WEBSOCKET
  // =========================================================

  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.error("JWT token nahi mila");
      return;
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/chat/ws/${token}`
    );

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
          setMessages((prev) => {
            const exists = prev.some(
              (item) =>
                Number(item.id) === Number(data.message_id)
            );

            if (exists) return prev;

            return [
              ...prev,
              {
                id: data.message_id,
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                message: data.message,
                is_read: data.is_read ?? false,
                created_at: data.created_at,
              },
            ];
          });
        }

        if (data.type === "error") {
          console.error("Chat error:", data.message);
        }
      } catch (error) {
        console.error("Invalid websocket response:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  // =========================================================
  // OPEN CHAT
  // =========================================================

  const openChat = async (user) => {
    try {
      setSelectedUser(user);
      setConversation(null);
      setMessages([]);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/chat/conversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();

        throw new Error(
          error.detail || "Conversation create nahi hui"
        );
      }

      const conversationData = await response.json();

      setConversation(conversationData);

      const messageResponse = await fetch(
        `${API_URL}/chat/${conversationData.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!messageResponse.ok) {
        throw new Error("Messages load nahi hue");
      }

      const oldMessages = await messageResponse.json();

      setMessages(oldMessages);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = () => {
    const text = message.trim();

    if (!text) return;

    if (!selectedUser) {
      alert("User select karo");
      return;
    }

    if (!conversation) {
      alert("Conversation open nahi hai");
      return;
    }

    if (!socketRef.current) {
      alert("WebSocket available nahi hai");
      return;
    }

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Chat server connected nahi hai");
      return;
    }

    setLoading(true);

    socketRef.current.send(
      JSON.stringify({
        receiver_id: selectedUser.id,
        message: text,
      })
    );

    setMessage("");
    setLoading(false);
  };

  const handleKeyDown = (event) => {
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
    });
  }, [messages]);

  // =========================================================
  // TIME
  // =========================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getInitial = (name = "") =>
    name.charAt(0).toUpperCase();

  const closeChat = () => {
    setSelectedUser(null);
    setConversation(null);
    setMessages([]);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f7f8fa] text-gray-900">

      <div className="flex h-full">

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={`
            flex w-full flex-col
            border-r border-gray-200
            bg-white
            md:w-[360px]
            lg:w-[390px]
            md:shrink-0
            ${selectedUser ? "hidden md:flex" : "flex"}
          `}
        >

          {/* SIDEBAR HEADER */}

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

              <div
                className={`
                  flex items-center gap-2 rounded-full
                  border px-3 py-1.5 text-xs font-medium
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
                    ${connected ? "bg-emerald-500" : "bg-red-500"}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people..."
                className="
                  h-11 w-full rounded-xl
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

            {users.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                  👥
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-700">
                  No users found
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Try searching with another name
                </p>

              </div>
            )}

            {users.map((user) => {

              const active =
                selectedUser?.id === user.id;

              return (
                <button
                  key={user.id}
                  onClick={() => openChat(user)}
                  className={`
                    group flex w-full items-center gap-3
                    border-b border-gray-100
                    px-4 py-3.5 text-left
                    transition-all
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
                        flex h-12 w-12 items-center justify-center
                        rounded-full text-base font-bold
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
                        absolute bottom-0 right-0
                        h-3 w-3 rounded-full
                        border-2 border-white
                        bg-emerald-500
                      "
                    />

                  </div>

                  {/* USER INFO */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <h2
                        className={`
                          truncate text-[14px] font-semibold
                          ${
                            active
                              ? "text-emerald-700"
                              : "text-gray-800"
                          }
                        `}
                      >
                        {user.name}
                      </h2>

                    </div>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {user.role || "Available to chat"}
                    </p>

                  </div>

                  {/* ARROW */}

                  <svg
                    className={`
                      h-4 w-4 shrink-0 transition
                      ${
                        active
                          ? "text-emerald-500"
                          : "text-gray-300 group-hover:text-gray-400"
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
            })}
          </div>
        </aside>

        {/* =====================================================
            CHAT
        ====================================================== */}

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

          {/* EMPTY STATE */}

          {!selectedUser ? (

            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f8fafb]">

              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />

              <div className="relative z-10 px-6 text-center">

                <div className="
                  mx-auto flex h-24 w-24
                  items-center justify-center
                  rounded-[28px]
                  bg-gradient-to-br
                  from-emerald-400
                  to-emerald-600
                  text-4xl
                  text-white
                  shadow-xl
                  shadow-emerald-200
                ">
                  💬
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-tight text-gray-800">
                  Your messages
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                  Select someone from the sidebar to start a
                  private conversation.
                </p>

                <div className="
                  mx-auto mt-6 inline-flex
                  items-center gap-2
                  rounded-full
                  bg-white px-4 py-2
                  text-xs font-medium
                  text-gray-500
                  shadow-sm
                  ring-1 ring-gray-100
                ">
                  <span className="text-emerald-500">●</span>
                  Real-time messaging enabled
                </div>

              </div>
            </div>

          ) : (

            <>

              {/* =================================================
                  CHAT HEADER
              ================================================== */}

              <header className="
                flex h-[70px] shrink-0
                items-center gap-3
                border-b border-gray-200
                bg-white px-3
                shadow-sm
                sm:px-5
              ">

                {/* BACK */}

                <button
                  onClick={closeChat}
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
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

                <div className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-indigo-100 to-purple-100
                  font-bold text-indigo-600
                ">
                  {getInitial(selectedUser.name)}
                </div>

                {/* USER INFO */}

                <div className="min-w-0 flex-1">

                  <h2 className="truncate text-[15px] font-semibold text-gray-900">
                    {selectedUser.name}
                  </h2>

                  <div className="mt-0.5 flex items-center gap-1.5">

                    <span
                      className={`
                        h-1.5 w-1.5 rounded-full
                        ${
                          connected
                            ? "bg-emerald-500"
                            : "bg-amber-400"
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

                {/* HEADER ACTIONS */}

                <button
                  className="
                    flex h-9 w-9 items-center
                    justify-center rounded-full
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-600
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
                  relative flex-1 overflow-y-auto
                  px-3 py-5
                  sm:px-6 sm:py-6
                "
                style={{
                  backgroundColor: "#f5f7f6",
                  backgroundImage:
                    "radial-gradient(rgba(0,0,0,.035) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >

                <div className="
                  mx-auto flex max-w-4xl
                  flex-col gap-2
                ">

                  {/* SECURITY BADGE */}

                  <div className="mb-4 flex justify-center">

                    <div className="
                      inline-flex items-center gap-2
                      rounded-full
                      bg-amber-50
                      px-3.5 py-2
                      text-[11px]
                      font-medium
                      text-amber-700
                      shadow-sm
                      ring-1 ring-amber-100
                    ">
                      <span>🔒</span>
                      Messages are private and secure
                    </div>

                  </div>

                  {messages.length === 0 && (
                    <div className="my-16 text-center">

                      <div className="
                        mx-auto flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        bg-white
                        text-xl
                        shadow-sm
                      ">
                        👋
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-500">
                        Say hello to {selectedUser.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Start your conversation below
                      </p>

                    </div>
                  )}

                  {messages.map((item) => {

                    const isMine =
                      Number(item.sender_id) ===
                      Number(currentUserId);

                    return (
                      <div
                        key={item.id}
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
                            group relative
                            max-w-[88%]
                            rounded-2xl
                            px-3.5 py-2.5
                            shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                            sm:max-w-[68%]
                            ${
                              isMine
                                ? `
                                  rounded-br-md
                                  bg-[#d9fdd3]
                                  text-gray-800
                                `
                                : `
                                  rounded-bl-md
                                  bg-white
                                  text-gray-800
                                `
                            }
                          `}
                        >

                          <p className="
                            whitespace-pre-wrap
                            break-words
                            pr-14
                            text-[14px]
                            leading-[1.45]
                          ">
                            {item.message}
                          </p>

                          <div className="
                            absolute bottom-1.5 right-2.5
                            flex items-center gap-1
                          ">

                            <span className="
                              text-[10px]
                              font-medium
                              text-gray-400
                            ">
                              {formatTime(item.created_at)}
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
                                {item.is_read ? "✓✓" : "✓"}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />

                </div>
              </section>

              {/* =================================================
                  MESSAGE INPUT
              ================================================== */}

              <footer className="
                shrink-0
                border-t border-gray-200
                bg-white
                px-2.5 py-2.5
                sm:px-5 sm:py-3
              ">

                <div className="
                  mx-auto flex max-w-4xl
                  items-end gap-2
                ">

                  {/* EMOJI */}

                  <button
                    type="button"
                    onClick={() =>
                      setMessage((prev) => `${prev} 😊`)
                    }
                    className="
                      hidden h-10 w-10 shrink-0
                      items-center justify-center
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

                  {/* TEXT INPUT */}

                  <div className="
                    flex flex-1 items-end
                    rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-1.5
                    transition
                    focus-within:border-emerald-300
                    focus-within:bg-white
                    focus-within:ring-4
                    focus-within:ring-emerald-50
                  ">

                    <textarea
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message..."
                      rows={1}
                      className="
                        max-h-32 min-h-10 flex-1
                        resize-none
                        border-0
                        bg-transparent
                        px-3 py-2.5
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
                      loading ||
                      !message.trim() ||
                      !connected
                    }
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-full
                      bg-emerald-500
                      text-white
                      shadow-sm
                      transition-all
                      hover:bg-emerald-600
                      hover:shadow-md
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:bg-gray-300
                      disabled:shadow-none
                    "
                    aria-label="Send message"
                  >
                    <svg
                      className="ml-0.5 h-4.5 w-4.5"
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

                <p className="
                  mx-auto mt-1.5
                  hidden max-w-4xl
                  text-[10px] text-gray-400
                  sm:block
                ">
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
