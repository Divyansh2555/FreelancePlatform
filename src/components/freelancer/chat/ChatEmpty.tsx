export default function ChatEmpty() {
  return (
    <div className="
      flex flex-1 items-center
      justify-center bg-[#f8fafb]
    ">

      <div className="text-center">

        <div className="
          mx-auto flex h-24 w-24
          items-center justify-center
          rounded-3xl bg-emerald-500
          text-4xl text-white
        ">
          💬
        </div>

        <h2 className="mt-7 text-3xl font-bold text-gray-800">
          Your messages
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Select someone from the sidebar to start a private conversation.
        </p>

      </div>

    </div>
  );
}