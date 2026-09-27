"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's the $100K H-1B fee and why does it matter?",
  "Why is domestic revenue growing faster than exports?",
  "What's the 51% talent gap about?",
];

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatAnswer(text: string) {
  const escaped = escapeHtml(text);
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    setError(null);
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessages([...next, { role: "assistant", content: data.text }]);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <p className="eyebrow">Vishleshan · IT Industry Analysis</p>
        <h1>India Built the World&rsquo;s Back Office. Now It&rsquo;s Building Its Brain.</h1>
        <p>Ask about any stat, claim, or recommendation on the poster.</p>
      </header>

      <div className="thread" ref={threadRef}>
        {messages.length === 0 && (
          <div className="empty-state">
            Every answer breaks down the claim, explains why it matters, and
            gives you the exact source behind it.
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-btn"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === "user" ? (
              <div className="bubble">{m.content}</div>
            ) : (
              <div
                className="bubble"
                dangerouslySetInnerHTML={{ __html: formatAnswer(m.content) }}
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="msg assistant loading">
            <div className="bubble">thinking through the poster data…</div>
          </div>
        )}

        {error && <p className="error-note">{error}</p>}
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a stat or claim…"
          autoFocus
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
