"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  {
    title: "H-1B fee",
    text: "What's the $100K H-1B fee and why does it matter?",
    icon: "◈",
  },
  {
    title: "Revenue shift",
    text: "Why is domestic revenue growing faster than exports?",
    icon: "↗",
  },
  {
    title: "Talent gap",
    text: "What's the 51% talent gap about?",
    icon: "◎",
  },
];

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatAnswer(text: string) {
  const escaped = escapeHtml(text || "");

  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const thread = threadRef.current;

    if (thread) {
      thread.scrollTo({
        top: thread.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();

    if (!question || loading) return;

    setError(null);

    const next: Message[] = [
      ...messages,
      {
        role: "user",
        content: question,
      },
    ];

    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: next,
        }),
      });

      const data = await res.json();

      console.log("API response:", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      if (!data.message) {
        setError("The server returned an empty response.");
        return;
      }

      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (err) {
      console.error(err);

      setError(
        "Couldn't reach the server. Check your connection and try again."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }

  return (
    <main className="app-shell">

      {/* Background */}
      <div className="background-grid" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            V
          </div>

          <div>
            <div className="brand-name">
              Vishleshan
            </div>

            <div className="brand-subtitle">
              IT INDUSTRY ANALYSIS
            </div>
          </div>
        </div>

        <div className="status">
          <span className="status-dot" />
          AI ANALYST
        </div>
      </header>

      {/* Main */}
      <section className="chat-container">

        {messages.length === 0 ? (
          <div className="welcome">

            <div className="welcome-badge">
              <span>✦</span>
              INTELLIGENCE LAYER
            </div>

            <h1>
              Understand the
              <span> numbers behind India&apos;s</span>
              <br />
              IT industry.
            </h1>

            <p className="welcome-description">
              Ask about any statistic, claim, or recommendation
              from the poster. Vishleshan breaks it down,
              explains the context, and traces the reasoning.
            </p>

            <div className="suggestion-grid">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.text}
                  className="suggestion-card"
                  onClick={() => send(suggestion.text)}
                >
                  <div className="suggestion-icon">
                    {suggestion.icon}
                  </div>

                  <div className="suggestion-content">
                    <span className="suggestion-title">
                      {suggestion.title}
                    </span>

                    <span className="suggestion-text">
                      {suggestion.text}
                    </span>
                  </div>

                  <span className="arrow">
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="welcome-note">
              <span>⌁</span>
              Ask a question to begin your analysis
            </div>
          </div>
        ) : (

          <div
            className="conversation"
            ref={threadRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-row ${message.role}`}
              >

                {message.role === "assistant" && (
                  <div className="avatar assistant-avatar">
                    V
                  </div>
                )}

                <div className="message-block">

                  <div className="message-label">
                    {message.role === "user"
                      ? "YOU"
                      : "VISHLESHAN"}
                  </div>

                  {message.role === "user" ? (
                    <div className="user-message">
                      {message.content}
                    </div>
                  ) : (
                    <div
                      className="assistant-message"
                      dangerouslySetInnerHTML={{
                        __html: formatAnswer(message.content),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">

                <div className="avatar assistant-avatar">
                  V
                </div>

                <div className="message-block">
                  <div className="message-label">
                    VISHLESHAN
                  </div>

                  <div className="assistant-message thinking">
                    <span>Analyzing</span>

                    <div className="thinking-dots">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-box">
                <span>!</span>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Composer */}
        <div className="composer-wrapper">

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="input-icon">
              ✦
            </div>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a statistic, claim, or recommendation..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-button"
            >
              <span>
                {loading ? "..." : "Ask"}
              </span>

              {!loading && (
                <span className="send-arrow">
                  ↑
                </span>
              )}
            </button>
          </form>

          <div className="composer-footer">
            <span>
              Vishleshan can make mistakes. Verify important claims.
            </span>

            <span className="shortcut">
              ENTER ↵
            </span>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="footer">
        <span>
          VISHLESHAN
        </span>

        <span className="footer-line" />

        <span>
          INDIA · TECHNOLOGY · DATA
        </span>
      </footer>

    </main>
  );
}