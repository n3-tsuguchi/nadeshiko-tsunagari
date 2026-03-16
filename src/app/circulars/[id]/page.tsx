"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchCircularById } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReadAloudButton } from "@/components/read-aloud-button";
import { useReadStatus } from "@/lib/read-status-context";
import type { CircularNotice } from "@/types";

export default function CircularDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [circular, setCircular] = useState<CircularNotice | null | undefined>(
    undefined
  );
  const { isRead, toggleRead } = useReadStatus();

  useEffect(() => {
    fetchCircularById(id).then((data) => setCircular(data));
  }, [id]);

  if (circular === undefined) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500 text-lg">
        読み込み中...
      </div>
    );
  }

  if (!circular) {
    notFound();
  }

  const read = isRead(circular.id);

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-lg text-pink-700 font-medium mb-6 hover:underline"
      >
        ← 一覧に戻る
      </Link>

      <div className="flex items-center flex-wrap gap-2 mb-4">
        <Badge variant={circular.category}>{circular.category}</Badge>
        {circular.isUrgent && (
          <span className="text-red-700 font-bold text-lg">⚠ 緊急</span>
        )}
        <time className="text-base text-gray-500 ml-auto shrink-0">
          {formatDate(circular.publishedAt)}
        </time>
      </div>

      <h1 className="text-2xl font-bold leading-snug mb-4">
        {circular.title}
      </h1>

      {/* 音声読み上げボタン */}
      <ReadAloudButton text={`${circular.title}。${circular.content}`} />

      <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-800 mb-6">
        {circular.content}
      </p>

      {circular.attachmentUrl && (
        <div className="mb-6 rounded-xl border border-gray-200 overflow-hidden">
          {circular.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img
              src={circular.attachmentUrl}
              alt="添付画像"
              className="w-full h-auto"
            />
          ) : (
            <a
              href={circular.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 text-lg text-pink-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <span aria-hidden="true">📎</span>
              添付ファイルを開く
            </a>
          )}
        </div>
      )}

      <div className="mb-6">
        {read ? (
          <span className="text-lg text-green-700 font-medium">✓ 既読</span>
        ) : (
          <span className="text-lg text-red-600 font-medium">● 未読</span>
        )}
      </div>

      <Button
        variant={read ? "secondary" : "primary"}
        size="lg"
        fullWidth
        onClick={() => toggleRead(circular.id)}
      >
        {read ? "✓ 既読" : "● 未読"}
      </Button>
    </div>
  );
}
