"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchCirculars, searchCirculars } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReadStatus } from "@/lib/read-status-context";
import type { CircularNotice } from "@/types";

const categories = ["すべて", "区役所", "町会", "防災", "子育て", "その他"] as const;
type CategoryFilter = (typeof categories)[number];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("すべて");
  const [circulars, setCirculars] = useState<CircularNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { isRead, toggleRead } = useReadStatus();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初回ロード
  useEffect(() => {
    fetchCirculars().then((data) => {
      setCirculars(data);
      setLoading(false);
    });
  }, []);

  // リアルタイム検索（300msデバウンス）
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const q = searchQuery.trim();
      setSearching(true);
      const data = q ? await searchCirculars(q) : await fetchCirculars();
      setCirculars(data);
      setSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const filtered =
    activeCategory === "すべて"
      ? circulars
      : circulars.filter((c) => c.category === activeCategory);

  const urgents = filtered.filter((c) => c.isUrgent);
  const normals = filtered
    .filter((c) => !c.isUrgent)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      {/* 検索バー */}
      <div className="mb-4 relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="回覧板を検索..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
          🔍
        </span>
        {searching && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            検索中...
          </span>
        )}
      </div>

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

      {loading && (
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      )}

      {/* 緊急のお知らせ */}
      {urgents.map((circular) => (
        <div key={circular.id} className="mb-4">
          <Card variant="urgent">
            <Link href={`/circulars/${circular.id}`} className="block">
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
              </CardBody>
            </Link>
            <div className="px-5 pb-4">
              <button
                onClick={() => toggleRead(circular.id)}
                className={[
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer border",
                  isRead(circular.id)
                    ? "bg-green-50 text-green-700 border-green-300 hover:bg-white"
                    : "bg-red-50 text-red-600 border-red-300 hover:bg-white",
                ].join(" ")}
              >
                {isRead(circular.id) ? "✓ 既読" : "● 未読"}
              </button>
            </div>
          </Card>
        </div>
      ))}

      {/* 通常のお知らせ */}
      <div className="flex flex-col gap-4">
        {normals.map((circular) => (
          <Card key={circular.id} variant="default">
            <Link href={`/circulars/${circular.id}`} className="block">
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
              </CardBody>
            </Link>
            <div className="px-5 pb-4">
              <button
                onClick={() => toggleRead(circular.id)}
                className={[
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer border",
                  isRead(circular.id)
                    ? "bg-green-50 text-green-700 border-green-300 hover:bg-white"
                    : "bg-red-50 text-red-600 border-red-300 hover:bg-white",
                ].join(" ")}
              >
                {isRead(circular.id) ? "✓ 既読" : "● 未読"}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 text-lg py-12">
          該当するお知らせはありません
        </p>
      )}
    </div>
  );
}
