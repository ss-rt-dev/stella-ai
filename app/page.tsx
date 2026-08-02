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
      content:
        "Hey! Ich bin Stella — deine KI, gebaut von Grok (xAI). Frag mich alles.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      inputRef.current?.focus();
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
        content:
          "Hey! Ich bin Stella — deine KI, gebaut von Grok (xAI). Frag mich alles.",
      },
    ]);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: "#000" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 0,
          minWidth: sidebarOpen ? 260 : 0,
          background: "#0f0f0f",
          borderRight: sidebarOpen ? "1px solid #1f1f1f" : "none",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease, min-width 0.2s ease",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={newChat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 12px",
              background: "transparent",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              color: "#ececec",
              fontSize: 14,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Neuer Chat
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          <div
            style={{
              padding: "8px 12px",
              fontSize: 12,
              color: "#6b6b6b",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Heute
          </div>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: "#1a1a1a",
              color: "#ececec",
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Stella Chat
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            borderTop: "1px solid #1f1f1f",
            fontSize: 12,
            color: "#6b6b6b",
          }}
        >
          Powered by Grok · xAI
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: "1px solid #1f1f1f",
            background: "#000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "#a0a0a0",
                cursor: "pointer",
                padding: 6,
                display: "flex",
                alignItems: "center",
                borderRadius: 6,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>Stella</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#6b6b6b",
              padding: "4px 10px",
              border: "1px solid #2a2a2a",
              borderRadius: 20,
            }}
          >
            Fast
          </div>
        </header>

        {/* Messages */}
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
              maxWidth: 720,
              width: "100%",
              margin: "0 auto",
              padding: "32px 20px 120px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  animation: "fadeIn 0.25s ease",
                }}
              >
                {msg.role === "user" ? (
                  <div
                    style={{
                      alignSelf: "flex-end",
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: 18,
                      padding: "10px 16px",
                      maxWidth: "85%",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: "#ececec",
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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
                        marginTop: 2,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        lineHeight: 1.65,
                        color: "#ececec",
                        paddingTop: 2,
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
                )}
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
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#a0a0a0",
                      animation: "pulse 1.2s infinite",
                    }}
                  />
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#a0a0a0",
                      animation: "pulse 1.2s infinite 0.2s",
                    }}
                  />
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#a0a0a0",
                      animation: "pulse 1.2s infinite 0.4s",
                    }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input area */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "linear-gradient(transparent, #000 30%)",
            padding: "0 16px 20px",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              alignItems: "flex-end",
              gap: 0,
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 24,
              padding: "10px 12px 10px 18px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to know?"
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#ececec",
                fontSize: 15,
                resize: "none",
                maxHeight: 140,
                lineHeight: 1.5,
                fontFamily: "inherit",
                padding: "6px 0",
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
                background: input.trim() && !isLoading ? "#fff" : "#2a2a2a",
                color: input.trim() && !isLoading ? "#000" : "#6b6b6b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#4a4a4a",
              marginTop: 10,
            }}
          >
            Stella AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}