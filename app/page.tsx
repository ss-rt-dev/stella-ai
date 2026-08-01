"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! Ich bin **Stella** — deine KI, gebaut von Grok (xAI). Frag mich alles. Was beschäftigt dich?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Ups, da ist etwas schiefgelaufen. Versuch es nochmal — oder check deine Verbindung.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "900px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--bg-secondary)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Stella AI
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Powered by Grok · xAI
          </p>
        </div>
      </header>

      {/* Messages */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background:
                  msg.role === "user"
                    ? "var(--user-bg)"
                    : "linear-gradient(135deg, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {msg.role === "user" ? (
                <User size={18} color="#c4b5fd" />
              ) : (
                <Bot size={18} color="white" />
              )}
            </div>
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "16px",
                background:
                  msg.role === "user" ? "var(--user-bg)" : "var(--assistant-bg)",
                border: "1px solid var(--border)",
                lineHeight: 1.55,
                fontSize: "0.95rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content.split("**").map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i}>{part}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={18} color="white" />
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "16px",
                background: "var(--assistant-bg)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: "6px",
              }}
            >
              <span className="dot" style={{ animation: "bounce 1.4s infinite ease-in-out both" }}>.</span>
              <span className="dot" style={{ animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.2s" }}>.</span>
              <span className="dot" style={{ animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.4s" }}>.</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-secondary)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-end",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "10px 12px",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreib Stella eine Nachricht..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontSize: "0.95rem",
              resize: "none",
              maxHeight: "120px",
              lineHeight: 1.5,
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              border: "none",
              background:
                input.trim() && !isLoading
                  ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
                  : "var(--border)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              transition: "opacity 0.2s",
              flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            marginTop: "10px",
          }}
        >
          Stella AI · Gebaut mit Next.js & Node.js · Powered by Grok
        </p>
      </footer>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}