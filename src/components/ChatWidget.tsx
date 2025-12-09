"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

// Inactivity timeout in milliseconds (1 minute)
const INACTIVITY_TIMEOUT = 1 * 60 * 1000;

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Function to parse markdown links and convert to React elements
  const parseMarkdownLinks = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to end the conversation and send email notification
  const endConversation = useCallback(async (reason: 'closed' | 'timeout') => {
    if (!conversationId || conversationEnded) return;

    setConversationEnded(true);

    try {
      await fetch("/api/chat/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          reason,
        }),
      });
      console.log(`[Chat] Conversation ended - reason: ${reason}`);
    } catch (error) {
      console.error("[Chat] Error ending conversation:", error);
    }
  }, [conversationId, conversationEnded]);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only set timer if conversation is active and open
    if (conversationId && isOpen && !conversationEnded) {
      inactivityTimerRef.current = setTimeout(() => {
        console.log("[Chat] Inactivity timeout reached");
        endConversation('timeout');
      }, INACTIVITY_TIMEOUT);
    }
  }, [conversationId, isOpen, conversationEnded, endConversation]);

  // Handle chat close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (conversationId && !conversationEnded) {
      endConversation('closed');
    }
  }, [conversationId, conversationEnded, endConversation]);

  // Set up inactivity timer when conversation starts
  useEffect(() => {
    if (conversationId && isOpen && !conversationEnded) {
      resetInactivityTimer();
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [conversationId, isOpen, conversationEnded, resetInactivityTimer]);

  // Handle page unload/close - send end notification
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (conversationId && !conversationEnded) {
        // Use sendBeacon for reliable delivery on page close
        navigator.sendBeacon(
          "/api/chat/end",
          JSON.stringify({
            conversationId,
            reason: 'closed',
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [conversationId, conversationEnded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "¡Hola! Bienvenido a TecnoExpress 👋\n\nPara ayudarte mejor, por favor dime:\n\n1️⃣ ¿Cuál es tu nombre?\n2️⃣ ¿Qué modelo de celular te interesa?\n\nTambién puedo ayudarte con información sobre precios, especificaciones técnicas, tiempos de entrega y realizar pedidos.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send page context only on first message (when no conversationId exists)
      const pageContext = !conversationId ? {
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer || undefined,
      } : undefined;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversationId,
          pageContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversationId);

      // Reset inactivity timer on successful message
      resetInactivityTimer();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted) return null;

  const chatContent = !isOpen ? (
    <div
      className="fixed bottom-8 right-8 flex flex-col items-end gap-3"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999
      }}
    >
      {/* Notification badge - positioned above the button */}
      <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 animate-bounce relative">
        <p className="text-sm font-medium whitespace-nowrap">¿Puedo ayudarte?</p>
        {/* Arrow pointing down to the button */}
        <div className="absolute -bottom-2 right-8 transform rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200"></div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  ) : (
    <div
      className="fixed bottom-8 right-8 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999
      }}
    >
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">TecnoExpress</h3>
            <p className="text-xs text-blue-100">Asistente Virtual</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="hover:bg-blue-700 p-1 rounded transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600"
                  : "bg-white border border-gray-200"
              }`}
              style={message.role === "user" ? { backgroundColor: '#2563eb' } : undefined}
            >
              <div className={`text-sm whitespace-pre-wrap ${
                message.role === "user" ? "text-white" : "text-gray-800"
              }`}>
                {message.content.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {parseMarkdownLinks(line)}
                    {lineIndex < message.content.split('\n').length - 1 && <br />}
                  </div>
                ))}
              </div>
              <span
                className={`text-xs mt-1 block ${
                  message.role === "user" ? "text-white opacity-90" : "text-gray-500"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Presiona Enter para enviar
        </p>
      </div>
    </div>
  );

  return createPortal(chatContent, document.body);
}
