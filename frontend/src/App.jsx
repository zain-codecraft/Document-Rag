import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function formatTime(date) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function App() {
  const [screen, setScreen] = useState("landing");
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

  if (screen === "landing") {
    return (
      <div className="relative min-h-screen overflow-hidden px-6 py-6 max-sm:px-3.5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,77,148,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(11,77,148,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,#7ab8ff_0%,#2483ff_55%,transparent_70%)] blur-3xl opacity-50" />
        <div className="pointer-events-none absolute -bottom-36 -right-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,#6ca2f2_0%,#0b4d94_58%,transparent_72%)] blur-3xl opacity-50" />

        <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-5 animate-rise">
          <nav className="flex items-center justify-between">
            <div className="brand-chip">KRWORK</div>
            <button type="button" className="ghost-btn" onClick={() => setScreen("chat")}>
              Open Assistant
            </button>
          </nav>

          <section className="glass-card rounded-[26px] bg-gradient-to-br from-white/90 to-blue-100/70 p-7 sm:p-10">
            <p className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-kr-700">
              South Korea Digital Marketing Agency
            </p>
            <h1 className="mb-3 mt-3 max-w-[16ch] font-display text-4xl font-extrabold leading-[1.05] text-kr-950 sm:text-6xl">
              Build measurable growth with KRWORK marketing expertise.
            </h1>
            <p className="m-0 max-w-3xl text-xl text-slate-700">
              KRWORK helps ambitious brands scale through performance marketing, SEO, paid media,
              and conversion-focused strategy built for real business outcomes.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button type="button" className="primary-btn" onClick={() => setScreen("chat")}>
                Talk to Assistant
              </button>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <article className="glass-card rounded-2xl p-4">
              <h3 className="m-0 font-display text-lg font-bold text-kr-900">Performance Marketing</h3>
              <p className="mt-1 text-slate-700">Data-led campaigns focused on efficient growth.</p>
            </article>
            <article className="glass-card rounded-2xl p-4">
              <h3 className="m-0 font-display text-lg font-bold text-kr-900">Search & Visibility</h3>
              <p className="mt-1 text-slate-700">SEO strategies that improve rankings and demand capture.</p>
            </article>
            <article className="glass-card rounded-2xl p-4">
              <h3 className="m-0 font-display text-lg font-bold text-kr-900">Conversion Strategy</h3>
              <p className="mt-1 text-slate-700">Landing page and funnel improvements that lift revenue.</p>
            </article>
          </section>
        </main>

        <button
          className="fixed bottom-6 right-6 z-20 inline-flex animate-floaty items-center gap-2 rounded-full bg-gradient-to-r from-kr-800 to-kr-500 px-3.5 py-2.5 font-display font-bold text-white shadow-[0_16px_38px_rgba(11,77,148,0.38)] max-sm:bottom-3.5 max-sm:right-3.5"
          type="button"
          onClick={() => setScreen("chat")}
          aria-label="Open chatbot"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-base">✦</span>
          <span>Chatbot</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-6 max-sm:px-3.5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,77,148,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(11,77,148,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,#7ab8ff_0%,#2483ff_55%,transparent_70%)] blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-36 -right-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,#6ca2f2_0%,#0b4d94_58%,transparent_72%)] blur-3xl opacity-50" />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-[0.95fr_1.25fr]">
        <section className="glass-card animate-rise rounded-3xl p-8 max-md:p-6">
          <div className="brand-chip">KRWORK</div>
          <h1 className="mb-3 mt-5 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold leading-[1.14] text-kr-900">
            South Korea Digital Marketing Knowledge Assistant
          </h1>
          <p className="m-0 text-[1.06rem] text-slate-700">
            Ask strategy, service, and agency questions from the indexed KRWORK documents.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-kr-700/15 bg-kr-100 px-2.5 py-1.5 text-sm text-kr-800">
              RAG Powered
            </span>
            <span className="rounded-full border border-kr-700/15 bg-kr-100 px-2.5 py-1.5 text-sm text-kr-800">
              Gemini + Chroma
            </span>
            <span className="rounded-full border border-kr-700/15 bg-kr-100 px-2.5 py-1.5 text-sm text-kr-800">
              FastAPI Backend
            </span>
          </div>
          <button type="button" className="ghost-btn mt-5" onClick={() => setScreen("landing")}>
            Back to Landing
          </button>
        </section>

        <section className="glass-card grid min-h-[84vh] grid-rows-[auto_1fr_auto_auto] rounded-3xl p-4 sm:p-5 animate-rise max-md:min-h-[75vh]">
          <header className="border-b border-kr-900/10 px-1.5 pb-2.5 pt-1">
            <h2 className="m-0 font-display text-2xl font-bold text-kr-900">Chat</h2>
            <p className="mb-0 mt-1 text-[0.95rem] text-slate-600">
              {sending ? "KRWORK assistant is thinking..." : "Ready"}
            </p>
          </header>

          <div className="grid gap-3 overflow-auto px-1.5 pb-2 pt-3.5" role="log" aria-live="polite">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className={`animate-rise rounded-2xl border border-kr-900/10 px-3.5 py-3 ${
                  msg.role === "user" ? "bg-gradient-to-br from-blue-100 to-blue-200" : "bg-blue-50/70"
                }`}
              >
                <div className="mb-2 flex justify-between gap-2.5">
                  <strong className="font-display text-sm font-bold text-kr-900">
                    {msg.role === "user" ? "You" : "KRWORK Assistant"}
                  </strong>
                  <time className="text-xs text-slate-500">{formatTime(msg.time)}</time>
                </div>
                <p className="m-0 whitespace-pre-wrap text-base text-slate-900">{msg.text}</p>
                {msg.sources?.length > 0 && (
                  <div className="mt-2.5 grid gap-1.5">
                    {msg.sources.slice(0, 4).map((src) => (
                      <div
                        className="flex items-center justify-between gap-2.5 rounded-lg border border-kr-700/20 bg-kr-100 px-2.5 py-2"
                        key={`${msg.id}-${src.chunk_id}`}
                      >
                        <span className="font-semibold text-kr-700">{src.filename}</span>
                        <small className="text-slate-600">{src.chunk_id}</small>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <form className="border-t border-kr-900/10 pt-3" onSubmit={onSubmit}>
            <textarea
              className="min-h-[74px] w-full resize-y rounded-xl border border-kr-700/25 p-3 font-body outline-none transition focus:border-kr-500 focus:shadow-[0_0_0_3px_rgba(36,131,255,0.2)]"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about KRWORK services, campaigns, or strategy..."
              rows={3}
            />
            <div className="mt-2.5 flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
              <span className="text-[0.82rem] text-slate-600">API: {API_BASE}</span>
              <button
                className="rounded-xl bg-gradient-to-r from-kr-700 to-kr-500 px-4 py-2.5 font-display font-bold text-white disabled:cursor-not-allowed disabled:opacity-65"
                type="submit"
                disabled={!canSend}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-rose-700">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
