"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LanguageCode } from "@/lib/types";
import { useAuth } from "@/lib/firebase/auth";
import { getCachedExplanations } from "@/lib/audio/cache";

const LANGS: { code: LanguageCode; label: string; bcp47: string }[] = [
  { code: "en", label: "English", bcp47: "en-US" },
  { code: "bn", label: "Bengali", bcp47: "bn-IN" },
  { code: "hi", label: "Hindi", bcp47: "hi-IN" },
  { code: "es", label: "Spanish", bcp47: "es-ES" },
];

/**
 * "Explain in Audio".
 *
 * Resolution order for the spoken text:
 *   1. Pre-generated cached text for the chosen language (free, instant).
 *   2. On-demand generation via the user's Gemini key (sign-in + key required) —
 *      used for custom ("other") languages or when nothing is cached.
 *   3. The on-device English explanation (always available).
 * The text is then spoken with the browser Speech API.
 */
export function AudioExplain({
  questionId,
  fallbackText,
}: {
  questionId: string;
  fallbackText: string;
}) {
  const { user, enabled } = useAuth();
  const [lang, setLang] = useState<LanguageCode | "other">("en");
  const [custom, setCustom] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [busy, setBusy] = useState(false);
  const [shownText, setShownText] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const cacheRef = useRef<Awaited<ReturnType<typeof getCachedExplanations>>>(null);
  const cacheLoaded = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function speak(text: string, bcp47?: string) {
    if (!supported || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    if (bcp47) u.lang = bcp47;
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }

  async function ensureCache() {
    if (!cacheLoaded.current) {
      cacheRef.current = await getCachedExplanations(questionId);
      cacheLoaded.current = true;
    }
    return cacheRef.current;
  }

  async function generateViaKey(languageLabel: string): Promise<string | null> {
    if (!user || user.isAnonymous) {
      setNote("Sign in and add your Gemini key in Settings for this language.");
      return null;
    }
    const token = await user.getIdToken();
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ questionId, language: languageLabel }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data.text as string;
    const map: Record<string, string> = {
      not_configured: "AI explanations aren’t enabled on this server yet.",
      no_key: "Add your Gemini key in Settings to use this language.",
      daily_limit: `Daily limit reached (${data.limit ?? ""}). Try again tomorrow.`,
      unauthorized: "Please sign in.",
      ai_error: "Couldn’t generate — check your key and quota.",
    };
    setNote(map[data.error] ?? "Couldn’t generate the explanation.");
    return null;
  }

  async function onExplain() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setNote(null);
    setBusy(true);
    try {
      if (lang !== "other") {
        const cached = await ensureCache();
        const cachedText = cached?.[lang];
        const bcp47 = LANGS.find((l) => l.code === lang)?.bcp47;
        if (cachedText) {
          setShownText(cachedText);
          speak(cachedText, bcp47);
          return;
        }
        if (lang === "en") {
          setShownText(fallbackText);
          speak(fallbackText, "en-US");
          return;
        }
        // Non-English, nothing cached → on-demand via key.
        const label = LANGS.find((l) => l.code === lang)?.label ?? "English";
        const text = await generateViaKey(label);
        if (text) {
          setShownText(text);
          speak(text, bcp47);
        } else {
          speak(fallbackText, "en-US"); // fall back to English audio
        }
        return;
      }
      // Custom "other" language → always on-demand via key.
      const label = custom.trim();
      if (!label) {
        setNote("Type a language name first.");
        return;
      }
      const text = await generateViaKey(label);
      if (text) {
        setShownText(text);
        speak(text);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-ca-line bg-ca-bg/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onExplain}
          disabled={!supported || busy}
          className="inline-flex items-center gap-2 rounded-md bg-ca-blue px-3 py-2 text-sm font-semibold text-white hover:bg-ca-blue-dark disabled:opacity-50"
        >
          <span aria-hidden>{speaking ? "⏹" : busy ? "…" : "🔊"}</span>
          {speaking ? "Stop" : "Explain in Audio"}
        </button>
        <label className="sr-only" htmlFor={`lang-${questionId}`}>
          Explanation language
        </label>
        <select
          id={`lang-${questionId}`}
          value={lang}
          onChange={(e) => setLang(e.target.value as LanguageCode | "other")}
          className="rounded-md border border-ca-line bg-white px-2 py-2 text-sm"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
          <option value="other">Other…</option>
        </select>
        {lang === "other" && (
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Language (e.g. Tamil)"
            className="rounded-md border border-ca-line bg-white px-2 py-2 text-sm"
          />
        )}
      </div>

      {shownText && <p className="mt-2 text-sm text-ca-gray">{shownText}</p>}
      {note && (
        <p className="mt-2 text-xs text-ca-muted">
          {note}{" "}
          {enabled && (
            <Link href="/settings" className="text-ca-blue underline">
              Open Settings
            </Link>
          )}
        </p>
      )}
      {!supported && (
        <p className="mt-2 text-xs text-ca-muted">
          Audio isn’t supported in this browser.
        </p>
      )}
    </div>
  );
}
