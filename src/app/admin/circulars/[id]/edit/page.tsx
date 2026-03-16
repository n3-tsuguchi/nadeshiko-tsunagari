"use client";

import { useState, useEffect, use, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCircularById, updateCircular } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["区役所", "町会", "防災", "子育て", "その他"] as const;

export default function EditCircularPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [currentAttachmentUrl, setCurrentAttachmentUrl] = useState<string | undefined>();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCircularById(id).then((data) => {
      if (data) {
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
        setIsUrgent(data.isUrgent);
        setCurrentAttachmentUrl(data.attachmentUrl);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    let attachmentUrl: string | null = currentAttachmentUrl ?? null;

    if (attachment) {
      const ext = attachment.name.split(".").pop();
      const filePath = `circulars/${Date.now()}_${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, attachment);

      if (uploadError) {
        setError("ファイルのアップロードに失敗しました: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(filePath);
      attachmentUrl = urlData.publicUrl;
    }

    const ok = await updateCircular(id, {
      title,
      content,
      category,
      is_urgent: isUrgent,
      attachment_url: attachmentUrl,
    });

    if (!ok) {
      setError("更新に失敗しました");
      setSubmitting(false);
      return;
    }

    router.push("/admin/circulars");
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
        href="/admin/circulars"
        className="inline-flex items-center text-lg text-pink-700 hover:underline"
      >
        ← 戻る
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">回覧板を編集</h1>

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
          <label htmlFor="edit-title" className="block text-lg font-semibold text-gray-900">
            タイトル
          </label>
          <input
            id="edit-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-category" className="block text-lg font-semibold text-gray-900">
            カテゴリ
          </label>
          <select
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-content" className="block text-lg font-semibold text-gray-900">
            本文
          </label>
          <textarea
            id="edit-content"
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg leading-relaxed text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-attachment" className="block text-lg font-semibold text-gray-900">
            添付ファイル
          </label>
          {currentAttachmentUrl && !attachment && (
            <p className="text-base text-gray-500">現在のファイルあり（新しいファイルを選択すると上書きされます）</p>
          )}
          <input
            id="edit-attachment"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-4 file:py-2 file:text-base file:font-medium file:text-pink-700 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="edit-urgent"
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-6 w-6 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="edit-urgent" className="text-lg font-medium text-red-700">
            緊急のお知らせ
          </label>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
          {submitting ? "保存中..." : "保存する"}
        </Button>
      </form>
    </div>
  );
}
