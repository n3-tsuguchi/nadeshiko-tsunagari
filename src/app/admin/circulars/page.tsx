"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchCirculars, deleteCircular } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CircularNotice } from "@/types";

export default function AdminCircularsPage() {
  const router = useRouter();
  const [circulars, setCirculars] = useState<CircularNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCirculars().then((data) => {
      setCirculars(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) return;
    const ok = await deleteCircular(id);
    if (ok) {
      setCirculars((prev) => prev.filter((c) => c.id !== id));
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
        <h1 className="text-2xl font-bold text-gray-900">回覧板管理</h1>
        <Link href="/admin/circulars/new">
          <Button variant="primary" size="md">
            新規作成
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      ) : circulars.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-12">
          回覧板はまだありません
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {circulars.map((c) => (
            <Card key={c.id} variant={c.isUrgent ? "urgent" : "default"}>
              <CardBody>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={c.category}>{c.category}</Badge>
                  {c.isUrgent && (
                    <span className="text-base font-semibold text-red-600">
                      緊急
                    </span>
                  )}
                  <time className="text-sm text-gray-500 ml-auto">
                    {formatDate(c.publishedAt)}
                  </time>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {c.title}
                </h3>
                <p className="text-base text-gray-500 mb-3">
                  既読 {c.readBy.length}人
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() =>
                      router.push(`/admin/circulars/${c.id}/edit`)
                    }
                  >
                    編集
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => handleDelete(c.id, c.title)}
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
