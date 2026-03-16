import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchEventById } from "@/lib/queries";
import { formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AlertButton } from "@/components/alert-button";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      {/* 戻るリンク */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-lg text-pink-700 font-medium mb-6 hover:underline"
      >
        ← イベント一覧に戻る
      </Link>

      {/* カテゴリ */}
      <div className="mb-4">
        <Badge variant={event.category}>{event.category}</Badge>
      </div>

      {/* イベント名 */}
      <h1 className="text-2xl font-bold leading-snug mb-6">{event.title}</h1>

      {/* 情報リスト */}
      <div className="flex flex-col gap-3 text-lg text-gray-800 mb-6">
        <p className="flex items-start gap-3">
          <span className="shrink-0" aria-hidden="true">
            📅
          </span>
          <span>{formatDate(event.date)}</span>
        </p>
        <p className="flex items-start gap-3">
          <span className="shrink-0" aria-hidden="true">
            🕐
          </span>
          <span>
            {formatTime(event.startTime)} 〜 {formatTime(event.endTime)}
          </span>
        </p>
        <p className="flex items-start gap-3">
          <span className="shrink-0" aria-hidden="true">
            📍
          </span>
          <span>{event.location}</span>
        </p>
        <p className="flex items-start gap-3">
          <span className="shrink-0" aria-hidden="true">
            👤
          </span>
          <span>{event.organizer}</span>
        </p>
        {event.maxParticipants !== undefined && (
          <p className="flex items-start gap-3">
            <span className="shrink-0" aria-hidden="true">
              👥
            </span>
            <span>
              参加者 {event.currentParticipants} / {event.maxParticipants} 人
            </span>
          </p>
        )}
      </div>

      {/* イベント画像 */}
      {event.imageUrl && (
        <div className="mb-6 rounded-xl overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 説明文 */}
      <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-800 mb-6">
        {event.description}
      </p>

      {/* 参加するボタン */}
      <AlertButton message="参加登録しました（MVP版）">
        参加する
      </AlertButton>
    </div>
  );
}
