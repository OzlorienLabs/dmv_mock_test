"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import { useAuth } from "@/lib/firebase/auth";
import { getAppCheckToken } from "@/lib/firebase/config";
import {
  DETAIL_LANGS,
  DETAIL_LANG_BCP47,
  DETAIL_LANG_LABEL,
  getDetailedExplanation,
  isDetailLang,
  type DetailLang,
} from "@/lib/explanations/detailed";

/**
 * "Explain in Audio".
 *
 * English, Bengali, and Spanish are fully offline: the detailed explanation is
 * bundled in the app and spoken with the browser's Speech API — no network or
 * server call. Any other language uses on-demand generation with the user's own
 * Gemini key (sign-in + key required).
 */
export function AudioExplain({ question }: { question: Question }) {
  const { user, enabled } = useAuth();
  const [lang, setLang] = useState<DetailLang | "other">("en");
  const [custom, setCustom] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [busy, setBusy] = useState(false);
  const [fetchedText, setFetchedText] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const displayText = useMemo(() => {
    if (lang === "other") return fetchedText ?? "";
    return getDetailedExplanation(lang, question);
  }, [lang, question, fetchedText]);

  function pickVoice(bcp47: string): SpeechSynthesisVoice | undefined {
    const lower = bcp47.toLowerCase();
    const short = lower.split("-")[0];
    return (
      voices.find((v) => v.lang.toLowerCase() === lower) ||
      voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(short))
    );
  }

  function speak(text: string, bcp47?: string) {
    if (!supported || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    if (bcp47) {
      u.lang = bcp47;
      const v = pickVoice(bcp47);
      if (v) u.voice = v;
    }
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }

  async function generateViaKey(languageLabel: string): Promise<string | null> {
    if (!user || user.isAnonymous) {
      setNote("Sign in and add your Gemini key in Settings for this language.");
      return null;
    }
    const token = await user.getIdToken();
    const appCheck = await getAppCheckToken();
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(appCheck ? { "X-Firebase-AppCheck": appCheck } : {}),
      },
      body: JSON.stringify({ questionId: question.id, language: languageLabel }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data.text as string;
    const map: Record<string, string> = {
      not_configured: "AI explanations aren’t enabled on this server yet.",
      no_key: "Add your Gemini key in Settings to use this language.",
      daily_limit: `Daily limit reached (${data.limit ?? ""}). Try again tomorrow.`,
      unauthorized: "Please sign in.",
      app_check: "Could not verify the app. Please reload and try again.",
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

    if (lang !== "other") {
      const bcp47 = DETAIL_LANG_BCP47[lang];
      speak(getDetailedExplanation(lang, question), bcp47);
      if (lang !== "en" && supported && !pickVoice(bcp47)) {
        setShowText(true); // no voice — reveal the text so it's still usable
        setNote(
          `Your device may not have a ${DETAIL_LANG_LABEL[lang]} voice installed — see the text below.`,
        );
      }
      return;
    }

    const label = custom.trim();
    if (!label) {
      setNote("Type a language name first.");
      return;
    }
    setBusy(true);
    try {
      const text = await generateViaKey(label);
      if (text) {
        setFetchedText(text);
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
        <label className="sr-only" htmlFor={`lang-${question.id}`}>
          Explanation language
        </label>
        <select
          id={`lang-${question.id}`}
          value={lang}
          onChange={(e) => {
            const v = e.target.value;
            setLang(isDetailLang(v) ? v : "other");
            setNote(null);
          }}
          className="rounded-md border border-ca-line bg-white px-2 py-2 text-sm"
        >
          {DETAIL_LANGS.map((l) => (
            <option key={l} value={l}>
              {DETAIL_LANG_LABEL[l]}
            </option>
          ))}
          <option value="other">Other…</option>
        </select>
        {lang === "other" && (
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Language (e.g. Tagalog)"
            className="rounded-md border border-ca-line bg-white px-2 py-2 text-sm"
          />
        )}
        {displayText && supported && (
          <button
            type="button"
            onClick={() => setShowText((s) => !s)}
            aria-expanded={showText || !supported}
            className="ml-auto text-xs font-semibold text-ca-blue underline underline-offset-2"
          >
            {showText ? "Hide text ▴" : "Show text ▾"}
          </button>
        )}
      </div>

      {(showText || !supported) && displayText && (
        <p className="mt-2 whitespace-pre-line text-sm text-ca-gray">{displayText}</p>
      )}
      {lang !== "other" && (
        <p className="mt-1 text-[11px] text-ca-muted">Reads aloud on your device — works offline.</p>
      )}
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
          Audio isn’t supported in this browser, but the text is shown above.
        </p>
      )}
    </div>
  );
}
