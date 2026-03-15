'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const EVENT_CATEGORIES = [
  '地域',
  '子育て',
  '高齢者',
  '防災',
  'スポーツ',
  'その他',
] as const;

export default function NewEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [category, setCategory] = useState<string>(EVENT_CATEGORIES[0]);
  const [maxParticipants, setMaxParticipants] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    alert('イベントを作成しました');
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
        新しいイベントを作成
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:max-w-2xl"
      >
        {/* イベント名 */}
        <div className="space-y-2">
          <label
            htmlFor="event-title"
            className="block text-lg font-semibold text-gray-900"
          >
            イベント名
          </label>
          <input
            id="event-title"
            name="title"
            type="text"
            aria-label="イベント名"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：グラウンドゴルフ大会"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 説明 */}
        <div className="space-y-2">
          <label
            htmlFor="event-description"
            className="block text-lg font-semibold text-gray-900"
          >
            説明
          </label>
          <textarea
            id="event-description"
            name="description"
            aria-label="イベントの説明"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="イベントの詳細を入力してください"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 開催日 */}
        <div className="space-y-2">
          <label
            htmlFor="event-date"
            className="block text-lg font-semibold text-gray-900"
          >
            開催日
          </label>
          <input
            id="event-date"
            name="date"
            type="date"
            aria-label="開催日"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 開始時間・終了時間 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="event-start-time"
              className="block text-lg font-semibold text-gray-900"
            >
              開始時間
            </label>
            <input
              id="event-start-time"
              name="startTime"
              type="time"
              aria-label="開始時間"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="event-end-time"
              className="block text-lg font-semibold text-gray-900"
            >
              終了時間
            </label>
            <input
              id="event-end-time"
              name="endTime"
              type="time"
              aria-label="終了時間"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        </div>

        {/* 場所 */}
        <div className="space-y-2">
          <label
            htmlFor="event-location"
            className="block text-lg font-semibold text-gray-900"
          >
            場所
          </label>
          <input
            id="event-location"
            name="location"
            type="text"
            aria-label="開催場所"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例：東住吉区民ホール"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 主催者 */}
        <div className="space-y-2">
          <label
            htmlFor="event-organizer"
            className="block text-lg font-semibold text-gray-900"
          >
            主催者
          </label>
          <input
            id="event-organizer"
            name="organizer"
            type="text"
            aria-label="主催者"
            required
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            placeholder="例：東住吉区役所"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* カテゴリ */}
        <div className="space-y-2">
          <label
            htmlFor="event-category"
            className="block text-lg font-semibold text-gray-900"
          >
            カテゴリ
          </label>
          <select
            id="event-category"
            name="category"
            aria-label="イベントのカテゴリ"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 定員 */}
        <div className="space-y-2">
          <label
            htmlFor="event-max-participants"
            className="block text-lg font-semibold text-gray-900"
          >
            定員
            <span className="ml-2 text-base font-normal text-gray-500">
              （任意）
            </span>
          </label>
          <input
            id="event-max-participants"
            name="maxParticipants"
            type="number"
            aria-label="定員（任意）"
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="例：50"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 送信ボタン */}
        <Button type="submit" variant="primary" size="lg" fullWidth>
          作成する
        </Button>
      </form>
    </div>
  );
}
