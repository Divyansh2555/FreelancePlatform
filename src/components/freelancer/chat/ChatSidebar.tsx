"use client";

import type { User } from "../../../types/freelamcers/chat";
import { getInitial } from "../../../lib/utils/chat";

interface Props {
  users: User[];
  selectedUser: User | null;
  search: string;
  setSearch: (value: string) => void;
  connected: boolean;
  loading: boolean;
  usersLoading: boolean;
  openChat: (user: User) => void;
}

export default function ChatSidebar({
  users,
  selectedUser,
  search,
  setSearch,
  connected,
  loading,
  usersLoading,
  openChat,
}: Props) {

  return (
    <aside className={`
      flex w-full flex-col border-r
      border-gray-200 bg-white
      md:w-[360px] md:shrink-0
      ${selectedUser ? "hidden md:flex" : "flex"}
    `}>

      <div className="border-b p-5">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold">
              Messages
            </h1>

            <p className="text-xs text-gray-400">
              Connect and chat instantly
            </p>
          </div>

          <span className={
            connected
              ? "text-emerald-500"
              : "text-red-500"
          }>
            ● {connected ? "Online" : "Offline"}
          </span>

        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people..."
          className="
            mt-5 h-11 w-full rounded-xl
            border bg-gray-50 px-4 text-sm
            outline-none focus:border-emerald-400
          "
        />

      </div>

      <div className="flex-1 overflow-y-auto">

        {usersLoading ? (

          <p className="p-5 text-center text-sm">
            Loading users...
          </p>

        ) : users.length === 0 ? (

          <p className="p-5 text-center text-sm text-gray-400">
            No users found
          </p>

        ) : (

          users.map((user) => (

            <button
              key={user.id}
              type="button"
              disabled={loading}
              onClick={() => openChat(user)}
              className={`
                flex w-full items-center gap-3
                border-b p-4 text-left
                ${
                  Number(selectedUser?.id) === Number(user.id)
                    ? "bg-emerald-50"
                    : "hover:bg-gray-50"
                }
              `}
            >

              <div className="
                flex h-12 w-12 items-center
                justify-center rounded-full
                bg-indigo-100 font-bold
                text-indigo-600
              ">
                {getInitial(user.name)}
              </div>

              <div className="flex-1">

                <h2 className="text-sm font-semibold">
                  {user.name}
                </h2>

                <p className="text-xs text-gray-400">
                  {user.role || "Available to chat"}
                </p>

              </div>

            </button>

          ))

        )}

      </div>

    </aside>
  );
}