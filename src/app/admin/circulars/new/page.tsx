"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

const CATEGORIES = ["区役所", "町会", "防災", "子育て", "その他"] as const;

export default function NewCircularPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");

    const { error: insertError } = await supabase.from("circulars").insert({
      title,
      content,
      category,
      is_urgent: isUrgent,
      author_id: user.id,
    });

    if (insertError) {
      setError("投稿に失敗しました: " + insertError.message);
      setSubmitting(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center text-lg text-pink-700 hover:underline"
        aria-label="管理者ダッシュボードに戻る"
      >
        ← 戻る
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900 lg:text-3xl">
        新しい回覧板を作成
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:max-w-2xl"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-base">
            {error}
          </div>
        )}

        {/* タイトル */}
        <div className="space-y-2">
          <label
            htmlFor="circular-title"
            className="block text-lg font-semibold text-gray-900"
          >
            タイトル
          </label>
          <input
            id="circular-title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：町会費納入のお願い"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* カテゴリ */}
        <div className="space-y-2">
          <label
            htmlFor="circular-category"
            className="block text-lg font-semibold text-gray-900"
          >
            カテゴリ
          </label>
          <select
            id="circular-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 本文 */}
        <div className="space-y-2">
          <label
            htmlFor="circular-content"
            className="block text-lg font-semibold text-gray-900"
          >
            本文
          </label>
          <textarea
            id="circular-content"
            name="content"
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="お知らせの内容を入力してください"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 緊急のお知らせ */}
        <div className="flex items-center gap-3">
          <input
            id="circular-urgent"
            name="isUrgent"
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-6 w-6 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <label
            htmlFor="circular-urgent"
            className="text-lg font-medium text-red-700"
          >
            緊急のお知らせ
          </label>
        </div>

        {/* 送信ボタン */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={submitting}
        >
          {submitting ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </div>
  );
}
