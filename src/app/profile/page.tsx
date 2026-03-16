"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useFontSize } from "@/lib/font-size-context";

const AREAS = [
  "東住吉区",
  "矢田北町会",
  "矢田南町会",
  "湯里町会",
  "中野町会",
  "桑津町会",
  "その他",
] as const;

const FONT_SIZES = [
  { value: "normal" as const, label: "標準" },
  { value: "large" as const, label: "大きい" },
  { value: "xlarge" as const, label: "特大" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { fontSize, setFontSize } = useFontSize();
  const [name, setName] = useState("");
  const [area, setArea] = useState<string>(AREAS[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name, area")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setName(data.name);
          setArea(data.area);
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ name, area })
      .eq("id", user.id);

    if (error) {
      setMessage("保存に失敗しました");
    } else {
      setMessage("保存しました");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500 text-lg">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* メールアドレス（読み取り専用） */}
        <div>
          <label className="block text-base font-medium text-gray-500 mb-1">
            メールアドレス
          </label>
          <p className="text-lg text-gray-900">{user?.email}</p>
        </div>

        {/* 表示名 */}
        <div>
          <label
            htmlFor="profile-name"
            className="block text-lg font-semibold text-gray-900 mb-1"
          >
            表示名
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* 地域 */}
        <div>
          <label
            htmlFor="profile-area"
            className="block text-lg font-semibold text-gray-900 mb-1"
          >
            地域
          </label>
          <select
            id="profile-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p
            className={`text-base font-medium ${message.includes("失敗") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "保存中..." : "保存する"}
        </Button>
      </div>

      {/* 文字サイズ設定 */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">文字の大きさ</h2>
        <div className="flex gap-3">
          {FONT_SIZES.map((fs) => (
            <button
              key={fs.value}
              onClick={() => setFontSize(fs.value)}
              className={[
                "flex-1 rounded-lg px-4 py-3 text-center font-medium border-2 transition-colors cursor-pointer",
                fontSize === fs.value
                  ? "border-pink-500 bg-pink-50 text-pink-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              {fs.label}
            </button>
          ))}
        </div>
      </div>

      {/* げんき確認リンク */}
      <Link
        href="/wellness"
        className="mt-6 block rounded-2xl border-2 border-green-300 bg-green-50 px-6 py-5 text-center hover:bg-green-100 transition-colors"
      >
        <span className="text-3xl" aria-hidden="true">😊</span>
        <p className="mt-1 text-lg font-bold text-green-800">今日のげんき確認</p>
        <p className="text-base text-green-600">体調を教えてください</p>
      </Link>
    </div>
  );
}
