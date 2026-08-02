"use client";

import { useState, useRef, useEffect } from "react";

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
      content: "Hey! Ich bin Stella — gebaut von Grok. Was willst du wissen?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

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

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Etwas ist schiefgelaufen. Versuch es nochmal.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const newChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hey! Ich bin Stella — gebaut von Grok. Was willst du wissen?",
      },
    ]);
    setSidebarOpen(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: "#000", position: "relative" }}>
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 280,
          background: "#0a0a0a",
          borderRight: "1px solid #1a1a1a",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={newChat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "11px 14px",
              background: "transparent",
              border: "1px solid #2a2a2a",
              borderRadius: 12,
              color: "#e8e8e8",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
          <div style={{ padding: "8px 12px 6px", fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: "0.03em" }}>
            TODAY
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "#141414",
              color: "#e8e8e8",
              fontSize: 13.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Stella Chat
          </div>
        </div>

        <div style={{ padding: "14px 16px", borderTop: "1px solid #1a1a1a", fontSize: 12, color: "#555" }}>
          Powered by Grok
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
        {/* Top bar – very minimal like Grok */}
        <header
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#888",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em" }}>Stella</span>
            <span
              style={{
                fontSize: 11,
                color: "#666",
                background: "#141414",
                border: "1px solid #222",
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              Fast
            </span>
          </div>

          <div style={{ width: 36 }} /> {/* spacer for balance */}
        </header>

        {/* Messages area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 768,
              margin: "0 auto",
              padding: "8px 16px 140px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              flex: 1,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  animation: "fadeIn 0.3s ease",
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {/* Simple Grok-like mark */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                )}

                <div
                  style={{
                    maxWidth: msg.role === "user" ? "80%" : "100%",
                    ...(msg.role === "user"
                      ? {
                          background: "#1a1a1a",
                          borderRadius: 18,
                          padding: "10px 16px",
                          border: "1px solid #252525",
                        }
                      : {
                          padding: "2px 0",
                        }),
                  }}
                >
                  <div
                    style={{
                      fontSize: 15.5,
                      lineHeight: 1.65,
                      color: "#e8e8e8",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.content.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} style={{ fontWeight: 600 }}>
                          {part}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div style={{ display: "flex", gap: 5, paddingTop: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#666",
                        animation: `pulseDot 1.3s infinite ${i * 0.18}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input – Grok style */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            padding: "0 12px 16px",
            background: "linear-gradient(to top, #000 70%, transparent)",
          }}
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              maxWidth: 768,
              margin: "0 auto",
              display: "flex",
              alignItems: "flex-end",
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: 28,
              padding: "8px 8px 8px 18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e8e8e8",
                fontSize: 15.5,
                resize: "none",
                maxHeight: 160,
                lineHeight: 1.5,
                fontFamily: "inherit",
                padding: "8px 0",
                overflowY: "auto",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: input.trim() && !isLoading ? "#fff" : "#222",
                color: input.trim() && !isLoading ? "#000" : "#555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                flexShrink: 0,
                transition: "background 0.15s, color 0.15s",
                marginLeft: 6,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#444",
              marginTop: 10,
              letterSpacing: "0.01em",
            }}
          >
            Stella can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}