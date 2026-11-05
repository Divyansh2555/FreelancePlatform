"use client";

import type { KeyboardEvent } from "react";

interface Props {
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
  disabled: boolean;
}

export default function ChatInput({
  message,
  setMessage,
  sendMessage,
  disabled,
}: Props) {

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <footer className="
      shrink-0 border-t bg-white
      px-3 py-3 sm:px-5
    ">

      <div className="
        mx-auto flex max-w-4xl
        items-end gap-2
      ">

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          rows={1}
          className="
            min-h-10 max-h-32 flex-1
            resize-none rounded-2xl
            border bg-gray-50 px-4 py-2.5
            text-sm outline-none
            focus:border-emerald-400
          "
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={disabled || !message.trim()}
          className="
            h-10 w-10 rounded-full
            bg-emerald-500 text-white
            disabled:bg-gray-300
          "
          aria-label="Send message"
        >
          ➤
        </button>

      </div>

      <p className="mt-2 hidden text-center text-[10px] text-gray-400 sm:block">
        Press Enter to send · Shift + Enter for a new line
      </p>

    </footer>
  );
}