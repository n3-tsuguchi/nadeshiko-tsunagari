import { notFound } from "next/navigation";
import Link from "next/link";
import { mockCirculars } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AlertButton } from "@/components/alert-button";

const CURRENT_USER_ID = "user-1";

export default async function CircularDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const circular = mockCirculars.find((c) => c.id === id);

  if (!circular) {
    notFound();
  }

  const isRead = circular.readBy.includes(CURRENT_USER_ID);

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-lg text-pink-700 font-medium mb-6 hover:underline"
      >
        ← 一覧に戻る
      </Link>

      {/* カテゴリ・日付・緊急ラベル */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <Badge variant={circular.category}>{circular.category}</Badge>
        {circular.isUrgent && (
          <span className="text-red-700 font-bold text-lg">⚠ 緊急</span>
        )}
        <time className="text-base text-gray-500 ml-auto shrink-0">
          {formatDate(circular.publishedAt)}
        </time>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl font-bold leading-snug mb-4">
        {circular.title}
      </h1>

      {/* 本文 */}
      <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-800 mb-6">
        {circular.content}
      </p>

      {/* 既読/未読 */}
      <div className="mb-6">
        {isRead ? (
          <span className="text-lg text-green-700 font-medium">✓ 既読</span>
        ) : (
          <span className="text-lg text-red-600 font-medium">● 未読</span>
        )}
      </div>

      {/* 既読にするボタン */}
      <AlertButton message="既読にしました（MVP版）">
        既読にする
      </AlertButton>
    </div>
  );
}
