"use client";

import { useEffect, useRef, useState } from "react";
import { getAppCheckToken } from "@/lib/firebase/config";

const FEEDBACK_TO = "ozlorienlabs@gmail.com";

type Status = "idle" | "sending" | "sent" | "mailto";

/**
 * "Ozlorien Labs" footer link that opens a feedback modal. Submissions POST to
 * /api/feedback (Resend email + Firestore save). If the backend isn't
 * configured, it gracefully falls back to a pre-filled mailto link so a visitor
 * can always reach out.
 */
export function FeedbackLink() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    textareaRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function reset() {
    setMessage("");
    setEmail("");
    setWebsite("");
    setStatus("idle");
    setError(null);
  }

  function close() {
    setOpen(false);
    // Reset shortly after closing so the modal isn't mid-animation empty.
    setTimeout(reset, 200);
  }

  function mailtoHref() {
    const body = `${message}\n\n${email ? `Reply to: ${email}` : ""}`;
    return `mailto:${FEEDBACK_TO}?subject=${encodeURIComponent(
      "Feedback — DMV Practice",
    )}&body=${encodeURIComponent(body)}`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 2) {
      setError("Please enter a little more detail.");
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      const appCheck = await getAppCheckToken();
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(appCheck ? { "X-Firebase-AppCheck": appCheck } : {}),
        },
        body: JSON.stringify({ message, email, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else if (data.error === "not_configured") {
        setStatus("mailto"); // offer the mailto fallback
      } else {
        setStatus("idle");
        setError(
          data.error === "rate_limited"
            ? "You've sent a few already — please try again later."
            : "Couldn't send just now. You can email us directly instead.",
        );
      }
    } catch {
      setStatus("mailto");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-semibold text-ca-blue underline underline-offset-2"
      >
        Ozlorien Labs
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback to Ozlorien Labs"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-ca-ink">Get in touch</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-ca-muted hover:bg-ca-bg"
              >
                ✕
              </button>
            </div>

            {status === "sent" ? (
              <div className="py-6 text-center">
                <p className="text-2xl" aria-hidden>
                  🙏
                </p>
                <p className="mt-2 font-semibold text-ca-ink">
                  Thanks for reaching out!
                </p>
                <p className="mt-1 text-sm text-ca-gray">
                  We appreciate you taking the time — we read every message.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 rounded-lg bg-ca-blue px-5 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
                >
                  Done
                </button>
              </div>
            ) : status === "mailto" ? (
              <div className="py-4 text-center">
                <p className="text-sm text-ca-gray">
                  We couldn&apos;t send it automatically. Tap below to email us
                  directly — your message is ready to go.
                </p>
                <a
                  href={mailtoHref()}
                  className="mt-4 inline-block rounded-lg bg-ca-blue px-5 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
                  onClick={() => setTimeout(close, 100)}
                >
                  Open email to {FEEDBACK_TO}
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-3 space-y-3">
                <p className="text-sm text-ca-gray">
                  Have feedback or a suggestion for the app? We&apos;d love to
                  hear it.
                </p>
                <label className="block text-sm font-medium text-ca-ink" htmlFor="fb-message">
                  Your message
                </label>
                <textarea
                  id="fb-message"
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={5000}
                  required
                  placeholder="What's on your mind?"
                  className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
                />
                <label className="block text-sm font-medium text-ca-ink" htmlFor="fb-email">
                  Email <span className="font-normal text-ca-muted">(optional, if you&apos;d like a reply)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-ca-line px-3 py-2 text-sm"
                />
                {/* Honeypot: hidden from users, catches bots. */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  aria-hidden
                />
                {error && <p className="text-sm text-ca-red">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-lg bg-ca-blue py-2.5 text-sm font-bold text-white hover:bg-ca-blue-dark disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
