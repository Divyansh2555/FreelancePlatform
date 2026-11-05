"use client";

import { useEffect, useRef } from "react";

import type { Message } from "../../../types/chat";

import { formatTime } from "../../../lib/utils/chat";

interface Props {
    messages: Message[];
    currentUserId: number | null;
    loading: boolean;
    userName: string;
}

export default function ChatMessages({
    messages,
    currentUserId,
    loading,
    userName,
}: Props) {

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <section className="
      flex-1 overflow-y-auto
      bg-[#f5f7f6] px-3 py-5
      sm:px-6
    ">

            <div className="
        mx-auto flex max-w-4xl
        flex-col gap-2
      ">

                <div className="mb-4 text-center">

                    <span className="
            rounded-full bg-amber-50
            px-4 py-2 text-xs
            text-amber-700
          ">
                        🔒 Messages are private and secure
                    </span>

                </div>

                {loading && messages.length === 0 && (

                    <p className="my-10 text-center text-sm text-gray-400">
                        Loading messages...
                    </p>

                )}

                {!loading && messages.length === 0 && (

                    <div className="my-16 text-center">

                        <div className="text-3xl">👋</div>

                        <p className="mt-3 text-sm text-gray-500">
                            Say hello to {userName}
                        </p>

                    </div>

                )}

                {messages.map((item, index) => {

                    const isMine =
                        Number(item.sender_id) === Number(currentUserId);

                    return (

                        <div
                            key={
                                item.id ??
                                `${item.created_at}-${index}`
                            }
                            className={`flex ${isMine ? "justify-end" : "justify-start"
                                }`}
                        >

                            <div className={`
                relative max-w-[85%]
                rounded-2xl px-4 py-2.5
                ${isMine
                                    ? "rounded-br-md bg-[#d9fdd3]"
                                    : "rounded-bl-md bg-white"
                                }
              `}>

                                <p className="
                  whitespace-pre-wrap
                  break-words pr-14
                  text-sm
                ">
                                    {item.message}
                                </p>

                                <div className="
                  absolute bottom-1.5 right-2
                  flex items-center gap-1
                ">

                                    <span className="text-[10px] text-gray-400">
                                        {formatTime(item.created_at)}
                                    </span>

                                    {isMine && (

                                        <span className={
                                            item.is_read
                                                ? "text-sky-500"
                                                : "text-gray-400"
                                        }>
                                            {item.is_read ? "✓✓" : "✓"}
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>

                    );
                })}

                <div ref={bottomRef} />

            </div>

        </section>
    );
}