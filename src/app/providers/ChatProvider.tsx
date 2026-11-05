"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useChat as useChatHook } from "../../hooks/freelancer/useChat";

type ChatContextType = ReturnType<typeof useChatHook>;

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChatHook();

  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used inside ChatProvider");
  }

  return context;
}