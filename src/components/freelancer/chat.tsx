"use client";

import { useChatContext } from "../../app/providers/ChatProvider";

import ChatSidebar from "../../components/freelancer/chat/ChatSidebar";
import ChatHeader from "../../components/freelancer/chat/ChatHeader";
import ChatMessages from "../../components/freelancer/chat/ChatMessages";
import ChatInput from "../../components/freelancer/chat/ChatInput";
import ChatEmpty from "../../components/freelancer/chat/ChatEmpty";

export default function MessagesPage() {
  const chat = useChatContext();

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f7f8fa] text-gray-900">
      <div className="flex h-full">

        <ChatSidebar
          users={chat.users}
          selectedUser={chat.selectedUser}
          search={chat.search}
          setSearch={chat.setSearch}
          connected={chat.connected}
          loading={chat.loading}
          usersLoading={chat.usersLoading}
          openChat={chat.openChat}
        />

        <main
          className={`flex flex-1 flex-col ${
            chat.selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {!chat.selectedUser ? (
            <ChatEmpty />
          ) : (
            <>
              <ChatHeader
                user={chat.selectedUser}
                connected={chat.connected}
                onBack={chat.closeChat}
              />

              <ChatMessages
                messages={chat.messages}
                currentUserId={chat.currentUserId}
                loading={chat.loading}
                userName={chat.selectedUser.name}
              />

              <ChatInput
                message={chat.message}
                setMessage={chat.setMessage}
                sendMessage={chat.sendMessage}
                disabled={
                  !chat.connected || !chat.conversation?.id
                }
              />
            </>
          )}
        </main>

      </div>
    </div>
  );
}