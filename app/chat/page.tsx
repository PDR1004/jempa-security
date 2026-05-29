"use client";

import { useConversation } from "@/app/hooks/useConversation";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useConversationStore, UserRole, Message, ConversationStore } from "@/app/store/conversation";
import { detectInjection } from "../utils/sanitize";

export default function ChatPage() {
  const { conversation, clearConversation } = useConversationStore() as ConversationStore;
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isLoading]);

  const { addMessageConversation } = useConversation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (detectInjection(inputValue)) {
      setError("Consulta no permitida. Detectamos un patrón sospechoso.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addMessageConversation(inputValue.trim());
      setInputValue("");
    } catch (error) {
      console.error("Error al obtener la respuesta de la IA:", error);
      setError("Error al enviar el mensaje. Intenta nuevamente.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-full w-full flex-1 flex-col items-center overflow-hidden mc-bg-cave text-white">
      <div className="relative flex h-full w-full max-w-3xl flex-1 flex-col overflow-hidden border-x-4 border-[#373737]">
        {conversation.length > 0 && (
          <div className="z-10 flex shrink-0 items-center justify-between mc-header px-4 py-3">
            <span className="mc-font-sm text-[0.45rem] text-[#8fdf8f]">
              {conversation.length} {conversation.length === 1 ? "mensaje" : "mensajes"}
            </span>
            <button
              onClick={() => clearConversation?.()}
              className="mc-btn mc-btn-red flex items-center gap-1.5 text-[0.45rem] px-3 py-2"
              title="Limpiar conversación"
              aria-label="Limpiar conversación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Limpiar chat
            </button>
          </div>
        )}

        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
          {conversation.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <img src="/mc-grass-block.svg" alt="" className="h-16 w-16 mb-4" aria-hidden="true" />
              <span className="mc-badge">
                Secure Campus IA
              </span>
              <p className="mt-4 text-xl text-white/70">
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
                  className={`max-w-[85%] px-4 py-3 text-lg sm:max-w-[75%] ${
                    msg.role === UserRole.Teacher
                      ? "mc-chat-user"
                      : "mc-chat-ai"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex items-center gap-2 mc-panel-dark px-4 py-4">
                <div className="mc-loading-dot" />
                <div className="mc-loading-dot" />
                <div className="mc-loading-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="z-20 flex shrink-0 gap-3 mc-header p-4"
        >
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="mc-input w-full disabled:opacity-50"
              disabled={isLoading}
              suppressHydrationWarning
            />
            {error && (
              <p className="mt-2 text-base text-[#ff6b6b] flex items-center gap-1.5">
                <span>⚠</span>
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="mc-btn mc-btn-green flex items-center justify-center px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Enviar mensaje"
            suppressHydrationWarning
          >
            ➤
          </button>
        </form>
      </div>
    </main>
  );
}
