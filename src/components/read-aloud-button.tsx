"use client";

import { useState, useCallback } from "react";

export function ReadAloudButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [text, speaking]);

  return (
    <button
      onClick={handleClick}
      className={[
        "mb-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium border-2 transition-colors cursor-pointer",
        speaking
          ? "border-red-400 bg-red-50 text-red-700"
          : "border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100",
      ].join(" ")}
      aria-label={speaking ? "読み上げを停止" : "音声で読み上げる"}
    >
      <span aria-hidden="true">{speaking ? "⏹" : "🔊"}</span>
      {speaking ? "停止する" : "読み上げる"}
    </button>
  );
}
