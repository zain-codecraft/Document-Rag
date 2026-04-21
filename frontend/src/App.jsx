import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function formatTime(date) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function App() {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Hello, I am KRWORK assistant. Ask anything about the agency knowledge base.",
      sources: [],
      time: new Date(),
    },
  ]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const canSend = useMemo(() => question.trim().length > 0 && !sending, [question, sending]);

  async function onSubmit(event) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || sending) {
      return;
    }

    setError("");
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      sources: [],
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, top_k: 4 }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();
      const botMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.answer || "No answer returned.",
        sources: Array.isArray(data.sources) ? data.sources : [],
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setError("Unable to reach the backend. Check API server and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="bg-orb orb-a" />
      <div className="bg-orb orb-b" />
      <div className="bg-grid" />

      <main className="chat-layout">
        <section className="brand-panel">
          <div className="brand-tag">KRWORK</div>
          <h1>South Korea Digital Marketing Knowledge Assistant</h1>
          <p>
            Ask strategy, service, and agency questions from the indexed KRWORK documents.
          </p>
          <div className="brand-meta">
            <span>RAG Powered</span>
            <span>Gemini + Chroma</span>
            <span>FastAPI Backend</span>
          </div>
        </section>

        <section className="chat-panel">
          <header className="chat-header">
            <h2>Chat</h2>
            <p>{sending ? "KRWORK assistant is thinking..." : "Ready"}</p>
          </header>

          <div className="messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className={`message ${msg.role === "user" ? "from-user" : "from-assistant"}`}
              >
                <div className="message-head">
                  <strong>{msg.role === "user" ? "You" : "KRWORK Assistant"}</strong>
                  <time>{formatTime(msg.time)}</time>
                </div>
                <p>{msg.text}</p>
                {msg.sources?.length > 0 && (
                  <div className="sources">
                    {msg.sources.slice(0, 4).map((src) => (
                      <div className="source-card" key={`${msg.id}-${src.chunk_id}`}>
                        <span>{src.filename}</span>
                        <small>{src.chunk_id}</small>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about KRWORK services, campaigns, or strategy..."
              rows={3}
            />
            <div className="composer-row">
              <span className="api-hint">API: {API_BASE}</span>
              <button type="submit" disabled={!canSend}>
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          {error && <p className="error-banner">{error}</p>}
        </section>
      </main>
    </div>
  );
}

export default App;
