"use client";

import { useState, useEffect, use, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchEventById, updateEvent } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const EVENT_CATEGORIES = ["地域", "子育て", "高齢者", "防災", "スポーツ", "その他"] as const;

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [category, setCategory] = useState<(typeof EVENT_CATEGORIES)[number]>(EVENT_CATEGORIES[0]);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEventById(id).then((data) => {
      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.date);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setLocation(data.location);
        setOrganizer(data.organizer);
        setCategory(data.category);
        setMaxParticipants(data.maxParticipants?.toString() ?? "");
        setCurrentImageUrl(data.imageUrl);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    let imageUrl: string | null = currentImageUrl ?? null;

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

    const ok = await updateEvent(id, {
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      organizer,
      category,
      max_participants: maxParticipants ? parseInt(maxParticipants) : null,
      image_url: imageUrl,
    });

    if (!ok) {
      setError("更新に失敗しました");
      setSubmitting(false);
      return;
    }

    router.push("/admin/events");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 text-center text-gray-500 text-lg">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
      <Link
        href="/admin/events"
        className="inline-flex items-center text-lg text-pink-700 hover:underline"
      >
        ← 戻る
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">イベントを編集</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:max-w-2xl"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-base">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="edit-title" className="block text-lg font-semibold text-gray-900">イベント名</label>
          <input id="edit-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-desc" className="block text-lg font-semibold text-gray-900">説明</label>
          <textarea id="edit-desc" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg leading-relaxed text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-date" className="block text-lg font-semibold text-gray-900">開催日</label>
          <input id="edit-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="edit-start" className="block text-lg font-semibold text-gray-900">開始時間</label>
            <input id="edit-start" type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-end" className="block text-lg font-semibold text-gray-900">終了時間</label>
            <input id="edit-end" type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-location" className="block text-lg font-semibold text-gray-900">場所</label>
          <input id="edit-location" type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-organizer" className="block text-lg font-semibold text-gray-900">主催者</label>
          <input id="edit-organizer" type="text" required value={organizer} onChange={(e) => setOrganizer(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-category" className="block text-lg font-semibold text-gray-900">カテゴリ</label>
          <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value as (typeof EVENT_CATEGORIES)[number])}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200">
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-max" className="block text-lg font-semibold text-gray-900">
            定員<span className="ml-2 text-base font-normal text-gray-500">（任意）</span>
          </label>
          <input id="edit-max" type="number" min={1} value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-image" className="block text-lg font-semibold text-gray-900">
            イベント画像<span className="ml-2 text-base font-normal text-gray-500">（任意）</span>
          </label>
          {currentImageUrl && !image && (
            <p className="text-base text-gray-500">現在の画像あり（新しい画像を選択すると上書きされます）</p>
          )}
          <input id="edit-image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-4 file:py-2 file:text-base file:font-medium file:text-pink-700 cursor-pointer" />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
          {submitting ? "保存中..." : "保存する"}
        </Button>
      </form>
    </div>
  );
}
