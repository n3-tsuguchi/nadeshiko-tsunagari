'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CATEGORIES = ['区役所', '町会', '防災', '子育て', 'その他'] as const;

export default function NewCircularPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    alert('投稿しました');
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
            aria-label="回覧板のタイトル"
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
            aria-label="回覧板のカテゴリ"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            aria-label="回覧板の本文"
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
            aria-label="緊急のお知らせとして投稿する"
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
        <Button type="submit" variant="primary" size="lg" fullWidth>
          投稿する
        </Button>
      </form>
    </div>
  );
}
