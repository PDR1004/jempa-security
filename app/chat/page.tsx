"use client";

import { useConversation } from "@/app/hooks/useConversation";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useConversationStore, UserRole, Message } from "@/app/store/conversation";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function ChatPage() {
  const { conversation, clearConversation } = useConversationStore() as any;
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isLoading]);

  const { addMessageConversation } = useConversation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);

    try {
      await addMessageConversation(inputValue.trim());
      setInputValue("");
    } catch (error) {
      console.error("Error al obtener la respuesta de la IA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`${manrope.className} flex h-full w-full flex-1 flex-col items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950`}>
      <div className="relative flex h-full w-full max-w-3xl flex-1 flex-col overflow-hidden border-x border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        {conversation.length > 0 && (
          <div className="z-10 flex shrink-0 items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-2 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/80">
            <span className="text-xs font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
              {conversation.length} {conversation.length === 1 ? "mensaje" : "mensajes"}
            </span>
            <button
              onClick={() => clearConversation?.()}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium tracking-tight text-zinc-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              title="Limpiar conversación"
              aria-label="Limpiar conversación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Limpiar chat
            </button>
          </div>
        )}

        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
          {conversation.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm font-medium tracking-tight text-zinc-400 dark:text-zinc-500">
              Inicia la conversación enviando un mensaje.
            </div>
          ) : (
            conversation.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === UserRole.Teacher ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed tracking-tight sm:max-w-[75%] ${
                    msg.role === UserRole.Teacher
                      ? "rounded-br-sm bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                      : "rounded-bl-sm bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-4 dark:bg-zinc-800">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="z-20 flex shrink-0 gap-2 border-t border-zinc-200 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium tracking-tight text-zinc-900 transition-shadow focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-zinc-500"
            disabled={isLoading}
            suppressHydrationWarning
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex aspect-square items-center justify-center rounded-full bg-zinc-900 p-3 text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-label="Enviar mensaje"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-ml-0.5 h-5 w-5">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
}
