"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchEvents, deleteEvent } from "@/lib/queries";
import { formatDate, formatTime } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) return;
    const ok = await deleteEvent(id);
    if (ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center text-lg text-pink-700 hover:underline"
      >
        ← 戻る
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">イベント管理</h1>
        <Link href="/admin/events/new">
          <Button variant="primary" size="md">
            新規作成
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-12">
          イベントはまだありません
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {events.map((e) => (
            <Card key={e.id}>
              <CardBody>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={e.category}>{e.category}</Badge>
                  <time className="text-sm text-gray-500 ml-auto">
                    {formatDate(e.date)}
                  </time>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {e.title}
                </h3>
                <p className="text-base text-gray-600 mb-1">
                  {formatTime(e.startTime)}〜{formatTime(e.endTime)} / {e.location}
                </p>
                <p className="text-base text-gray-500 mb-3">
                  参加者 {e.currentParticipants}
                  {e.maxParticipants !== undefined ? ` / ${e.maxParticipants}` : ""}人
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => router.push(`/admin/events/${e.id}/edit`)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => handleDelete(e.id, e.title)}
                  >
                    削除
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
