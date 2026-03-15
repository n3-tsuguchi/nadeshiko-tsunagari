"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCirculars } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReadStatus } from "@/lib/read-status-context";
import type { CircularNotice } from "@/types";

export default function NoticesPage() {
  const { isRead, toggleRead, unreadCount } = useReadStatus();
  const [circulars, setCirculars] = useState<CircularNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCirculars().then((data) => {
      setCirculars(data);
      setLoading(false);
    });
  }, []);

  const unreadCirculars = circulars.filter((c) => !isRead(c.id));

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">お知らせ</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      ) : unreadCirculars.length > 0 ? (
        <>
          <p className="text-lg font-medium text-gray-700 mb-4">
            未読のお知らせ:{" "}
            <span className="text-pink-600">{unreadCount}件</span>
          </p>

          <div className="space-y-4">
            {unreadCirculars.map((circular) => (
              <Card
                key={circular.id}
                variant={circular.isUrgent ? "urgent" : "default"}
              >
                <Link href={`/circulars/${circular.id}`} className="block">
                  <CardBody>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={circular.category} size="sm">
                        {circular.category}
                      </Badge>
                      {circular.isUrgent && (
                        <span className="text-red-600 font-bold text-sm">
                          緊急
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold leading-snug mb-1">
                      {circular.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(circular.publishedAt)}
                    </p>
                    <p className="text-base text-gray-700 line-clamp-2">
                      {circular.content}
                    </p>
                  </CardBody>
                </Link>
                <CardFooter>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => toggleRead(circular.id)}
                  >
                    既読にする
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-4xl mb-4">🎉</p>
          <p className="text-xl font-bold text-gray-600">
            未読のお知らせはありません
          </p>
        </div>
      )}
    </div>
  );
}
