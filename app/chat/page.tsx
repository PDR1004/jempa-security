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
    <main className={`${manrope.className} flex h-full w-full flex-1 flex-col items-center overflow-hidden bg-[#020813] text-zinc-100`}>
      <div className="relative flex h-full w-full max-w-3xl flex-1 flex-col overflow-hidden border-x border-zinc-900 bg-[#020813]/50">
        {conversation.length > 0 && (
          <div className="z-10 flex shrink-0 items-center justify-between border-b border-emerald-500/15 bg-[#020813]/90 px-4 py-3 backdrop-blur-md">
            <span className="text-xs font-medium tracking-tight text-emerald-400">
              {conversation.length} {conversation.length === 1 ? "mensaje" : "mensajes"}
            </span>
            <button
              onClick={() => clearConversation?.()}
              className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium tracking-tight text-red-400 transition-all hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
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
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
                Secure Campus IA
              </span>
              <p className="mt-4 text-sm font-medium tracking-tight text-zinc-400">
                Inicia la conversación enviando un mensaje.
              </p>
            </div>
          ) : (
            conversation.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === UserRole.Teacher ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm font-medium leading-relaxed tracking-tight sm:max-w-[75%] ${
                    msg.role === UserRole.Teacher
                      ? "rounded-2xl rounded-tr-md bg-emerald-900/45 text-zinc-100"
                      : "rounded-2xl rounded-tl-md bg-zinc-800/75 text-zinc-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-zinc-800/75 px-4 py-4">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400/60 [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400/60 [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400/60" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="z-20 flex shrink-0 gap-3 border-t border-emerald-500/15 bg-[#020813]/90 p-4 backdrop-blur-md"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-zinc-800 bg-[#081426] px-5 py-3 text-sm font-medium tracking-tight text-zinc-100 transition-shadow focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 placeholder:text-zinc-500 disabled:opacity-50"
            disabled={isLoading}
            suppressHydrationWarning
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex aspect-square items-center justify-center rounded-full bg-emerald-500 p-3 text-[#021209] transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
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
