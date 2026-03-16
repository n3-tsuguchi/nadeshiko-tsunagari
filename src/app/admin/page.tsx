"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCirculars, fetchEvents, fetchTodayWellnessSummary } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import { exportCircularReads, exportEventParticipants } from "@/lib/csv-export";
import { formatDate, formatTime } from "@/lib/utils";
import type { CircularNotice, Event } from "@/types";

export default function AdminDashboard() {
  const [circulars, setCirculars] = useState<CircularNotice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [wellness, setWellness] = useState({ total: 0, genki: 0, sukoshi: 0, tsurai: 0 });
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCirculars(),
      fetchEvents(),
      fetchTodayWellnessSummary(),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]).then(([c, e, w, profilesRes]) => {
      setCirculars(c);
      setEvents(e);
      setWellness(w);
      setUserCount(profilesRes.count ?? 0);
      setLoading(false);
    });
  }, []);

  // ─── 統計の計算 ───────────────────────────────────────
  const totalCirculars = circulars.length;
  const totalReadEntries = circulars.reduce(
    (sum, c) => sum + c.readBy.length,
    0
  );
  const totalPossibleReads = totalCirculars * (userCount || 1);
  const unreadRate =
    totalPossibleReads > 0
      ? Math.round(
          ((totalPossibleReads - totalReadEntries) / totalPossibleReads) * 100
        )
      : 0;

  const totalEvents = events.length;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const eventsThisMonth = events.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // 直近3件の回覧板（新しい順）
  const recentCirculars = [...circulars]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  // 今後のイベント（日付が近い順）
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
        管理者ダッシュボード
      </h1>
      <p className="mt-1 text-lg text-gray-600">なでしこつながり 管理画面</p>

      {/* ─── 統計カード 2x2 ───────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <p className="text-base text-gray-500">回覧板</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {totalCirculars}
              <span className="ml-1 text-lg font-normal text-gray-500">
                件
              </span>
            </p>
            <p className="mt-1 text-base text-orange-600">
              未読率 {unreadRate}%
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-base text-gray-500">イベント</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {totalEvents}
              <span className="ml-1 text-lg font-normal text-gray-500">
                件
              </span>
            </p>
            <p className="mt-1 text-base text-blue-600">
              今月 {eventsThisMonth}件
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-base text-gray-500">登録住民</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {userCount}
              <span className="ml-1 text-lg font-normal text-gray-500">
                人
              </span>
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-base text-gray-500">今日のげんき確認</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {wellness.total}
              <span className="ml-1 text-lg font-normal text-gray-500">
                人
              </span>
            </p>
            <p className="mt-1 text-base text-green-600">
              😊{wellness.genki} 😐{wellness.sukoshi} 😢{wellness.tsurai}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* ─── アクションボタン ─────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Link href="/admin/circulars">
          <Button variant="primary" size="lg" fullWidth>
            回覧板管理
          </Button>
        </Link>
        <Link href="/admin/events">
          <Button variant="secondary" size="lg" fullWidth>
            イベント管理
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button variant="ghost" size="lg" fullWidth>
            ユーザー管理
          </Button>
        </Link>
      </div>

      {/* ─── データ出力 ───────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <button
          onClick={exportCircularReads}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          回覧板の既読データをCSV出力
        </button>
        <button
          onClick={exportEventParticipants}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          イベント参加者をCSV出力
        </button>
      </div>

      {/* ─── 最近の回覧板 ─────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">最近の回覧板</h2>
        <div className="mt-4 space-y-4">
          {recentCirculars.map((c) => (
            <Card key={c.id} variant={c.isUrgent ? "urgent" : "default"}>
              <CardBody>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={c.category}>{c.category}</Badge>
                  {c.isUrgent && (
                    <span className="text-base font-semibold text-red-600">
                      緊急
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {c.title}
                </h3>
                <p className="mt-1 text-base text-gray-500">
                  {formatDate(c.publishedAt)} ・ 既読 {c.readBy.length}人
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 今後のイベント ───────────────────────────────── */}
      <section className="mt-10 pb-8">
        <h2 className="text-xl font-bold text-gray-900">今後のイベント</h2>
        <div className="mt-4 space-y-4">
          {upcomingEvents.map((e) => (
            <Card key={e.id}>
              <CardBody>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={e.category}>{e.category}</Badge>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {e.title}
                </h3>
                <p className="mt-1 text-base text-gray-600">
                  {formatDate(e.date)} {formatTime(e.startTime)}〜
                  {formatTime(e.endTime)}
                </p>
                <p className="text-base text-gray-500">{e.location}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
