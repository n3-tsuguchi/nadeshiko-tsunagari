"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getTodayWellness,
  submitWellness,
  type WellnessStatus,
} from "@/lib/queries";

const STATUS_OPTIONS: {
  value: WellnessStatus;
  emoji: string;
  label: string;
  color: string;
  activeColor: string;
}[] = [
  {
    value: "genki",
    emoji: "😊",
    label: "元気です",
    color: "border-green-300 bg-green-50 text-green-800",
    activeColor: "border-green-500 bg-green-100 text-green-900 ring-2 ring-green-500",
  },
  {
    value: "sukoshi",
    emoji: "😐",
    label: "少し不調",
    color: "border-yellow-300 bg-yellow-50 text-yellow-800",
    activeColor: "border-yellow-500 bg-yellow-100 text-yellow-900 ring-2 ring-yellow-500",
  },
  {
    value: "tsurai",
    emoji: "😢",
    label: "つらい",
    color: "border-red-300 bg-red-50 text-red-800",
    activeColor: "border-red-500 bg-red-100 text-red-900 ring-2 ring-red-500",
  },
];

export default function WellnessPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<WellnessStatus | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getTodayWellness(user.id).then((data) => {
      if (data) {
        setSelected(data.status);
        setSubmitted(true);
      }
      setLoading(false);
    });
  }, [user]);

  const handleSubmit = async (status: WellnessStatus) => {
    if (!user) return;
    setSelected(status);
    const ok = await submitWellness(user.id, status);
    if (ok) {
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500 text-lg">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">今日のげんき確認</h1>
      <p className="text-base text-gray-600 mb-8">
        今日の体調を教えてください
      </p>

      <div className="flex flex-col gap-4">
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSubmit(opt.value)}
              className={[
                "flex items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left transition-all cursor-pointer",
                isSelected ? opt.activeColor : opt.color,
              ].join(" ")}
            >
              <span className="text-5xl" aria-hidden="true">
                {opt.emoji}
              </span>
              <span className="text-xl font-bold">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="mt-8 text-center">
          <p className="text-lg font-medium text-green-700">
            今日の確認を送信しました
          </p>
          <p className="text-base text-gray-500 mt-1">
            いつでも変更できます
          </p>
        </div>
      )}
    </div>
  );
}
