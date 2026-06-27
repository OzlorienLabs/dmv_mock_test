"use client";

import { useEffect, useRef, useState } from "react";
import type { LanguageCode } from "@/lib/types";

const LANGS: { code: LanguageCode | "other"; label: string; bcp47: string }[] = [
  { code: "en", label: "English", bcp47: "en-US" },
  { code: "bn", label: "Bengali", bcp47: "bn-IN" },
  { code: "hi", label: "Hindi", bcp47: "hi-IN" },
  { code: "es", label: "Spanish", bcp47: "es-ES" },
];

/**
 * "Explain in Audio" control.
 *
 * Phase 1: reads the English explanation aloud using the browser Speech API as
 * a working preview, with a language selector. Detailed AI explanations and
 * high-quality multilingual audio (English, Bengali, Hindi, Spanish + custom)
 * are generated via Gemini + Cloud TTS in Phase 4.
 */
export function AudioExplain({ text }: { text: string }) {
  const [lang, setLang] = useState<LanguageCode | "other">("en");
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function toggle() {
    if (!supported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const bcp47 = LANGS.find((l) => l.code === lang)?.bcp47 ?? "en-US";
    const u = new SpeechSynthesisUtterance(text);
    u.lang = bcp47;
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }

  return (
    <div className="mt-3 rounded-lg border border-ca-line bg-ca-bg/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          disabled={!supported}
          className="inline-flex items-center gap-2 rounded-md bg-ca-blue px-3 py-2 text-sm font-semibold text-white hover:bg-ca-blue-dark disabled:opacity-50"
        >
          <span aria-hidden>{speaking ? "⏹" : "🔊"}</span>
          {speaking ? "Stop" : "Explain in Audio"}
        </button>
        <label className="sr-only" htmlFor="explain-lang">
          Explanation language
        </label>
        <select
          id="explain-lang"
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
      </div>
      {!supported && (
        <p className="mt-2 text-xs text-ca-muted">
          Audio isn&apos;t supported in this browser.
        </p>
      )}
      {lang !== "en" && (
        <p className="mt-2 text-xs text-ca-muted">
          Detailed AI explanations and natural Bengali/Hindi/Spanish audio are
          coming soon. This is a quick browser preview.
        </p>
      )}
    </div>
  );
}
