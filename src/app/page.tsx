"use client";

import { useState } from "react";
import { mockCirculars } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CircularNotice } from "@/types";

const CURRENT_USER_ID = "user-1";

const categories = ["すべて", "区役所", "町会", "防災", "子育て", "その他"] as const;
type CategoryFilter = (typeof categories)[number];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("すべて");

  const filtered =
    activeCategory === "すべて"
      ? mockCirculars
      : mockCirculars.filter((c) => c.category === activeCategory);

  // 緊急を先頭、その後は公開日の新しい順
  const urgents = filtered.filter((c) => c.isUrgent);
  const normals = filtered
    .filter((c) => !c.isUrgent)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const isRead = (circular: CircularNotice) =>
    circular.readBy.includes(CURRENT_USER_ID);

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      {/* カテゴリフィルター */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              "shrink-0 px-4 py-2 rounded-full text-base font-medium border transition-colors duration-150 cursor-pointer",
              activeCategory === cat
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 緊急のお知らせ */}
      {urgents.map((circular) => (
        <div key={circular.id} className="mb-4">
          <Card variant="urgent">
            <CardHeader className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-red-700 font-bold text-base">
                  ⚠ 緊急
                </span>
                <Badge variant={circular.category} size="sm">
                  {circular.category}
                </Badge>
              </div>
              <time className="text-sm text-gray-500 shrink-0">
                {formatDate(circular.publishedAt)}
              </time>
            </CardHeader>
            <CardBody>
              <h2 className="text-xl font-bold leading-snug mb-2">
                {circular.title}
              </h2>
              <p className="text-base text-gray-700 line-clamp-2 leading-relaxed">
                {circular.content}
              </p>
              <div className="mt-3">
                {isRead(circular) ? (
                  <span className="text-sm text-green-700 font-medium">
                    ✓ 既読
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    ● 未読
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      ))}

      {/* 通常のお知らせ */}
      <div className="flex flex-col gap-4">
        {normals.map((circular) => (
          <Card key={circular.id} variant="default">
            <CardHeader className="flex items-center justify-between gap-2">
              <Badge variant={circular.category} size="sm">
                {circular.category}
              </Badge>
              <time className="text-sm text-gray-500 shrink-0">
                {formatDate(circular.publishedAt)}
              </time>
            </CardHeader>
            <CardBody>
              <h2 className="text-lg font-bold leading-snug mb-2">
                {circular.title}
              </h2>
              <p className="text-base text-gray-700 line-clamp-2 leading-relaxed">
                {circular.content}
              </p>
              <div className="mt-3">
                {isRead(circular) ? (
                  <span className="text-sm text-green-700 font-medium">
                    ✓ 既読
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    ● 未読
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 text-lg py-12">
          該当するお知らせはありません
        </p>
      )}
    </div>
  );
}
