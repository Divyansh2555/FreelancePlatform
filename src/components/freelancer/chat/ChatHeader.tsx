"use client";

import type { User } from "../../../types/freelamcers/chat";
import { getInitial } from "../../../lib/utils/chat";

interface Props {
  user: User;
  connected: boolean;
  onBack: () => void;
}

export default function ChatHeader({
  user,
  connected,
  onBack,
}: Props) {

  return (
    <header className="
      flex h-[70px] shrink-0
      items-center gap-3
      border-b bg-white px-4
    ">

      <button
        type="button"
        onClick={onBack}
        className="md:hidden"
        aria-label="Back"
      >
        ←
      </button>

      <div className="
        flex h-11 w-11 items-center
        justify-center rounded-full
        bg-indigo-100 font-bold
        text-indigo-600
      ">
        {getInitial(user.name)}
      </div>

      <div>

        <h2 className="text-sm font-semibold">
          {user.name}
        </h2>

        <p className="text-xs text-gray-400">
          {connected ? "Online" : "Connecting..."}
        </p>

      </div>

    </header>
  );
}