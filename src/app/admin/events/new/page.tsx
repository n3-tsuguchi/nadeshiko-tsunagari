"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

const EVENT_CATEGORIES = [
  "地域",
  "子育て",
  "高齢者",
  "防災",
  "スポーツ",
  "その他",
] as const;

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [category, setCategory] = useState<(typeof EVENT_CATEGORIES)[number]>(EVENT_CATEGORIES[0]);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");

    let imageUrl: string | null = null;

    if (image) {
      const ext = image.name.split(".").pop();
      const filePath = `events/${Date.now()}_${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, image);

      if (uploadError) {
        setError("画像のアップロードに失敗しました: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("events").insert({
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      organizer,
      category,
      max_participants: maxParticipants ? parseInt(maxParticipants) : null,
      author_id: user.id,
      image_url: imageUrl,
    });

    if (insertError) {
      setError("作成に失敗しました: " + insertError.message);
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
        新しいイベントを作成
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
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof EVENT_CATEGORIES)[number])}
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
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="例：50"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* イベント画像 */}
        <div className="space-y-2">
          <label
            htmlFor="event-image"
            className="block text-lg font-semibold text-gray-900"
          >
            イベント画像
            <span className="ml-2 text-base font-normal text-gray-500">
              （任意）
            </span>
          </label>
          <input
            id="event-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-4 file:py-2 file:text-base file:font-medium file:text-pink-700 cursor-pointer"
          />
          {image && (
            <p className="text-base text-gray-500">
              選択中: {image.name}
            </p>
          )}
        </div>

        {/* 送信ボタン */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={submitting}
        >
          {submitting ? "作成中..." : "作成する"}
        </Button>
      </form>
    </div>
  );
}
