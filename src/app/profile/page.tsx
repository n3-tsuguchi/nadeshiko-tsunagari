"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const AREAS = [
  "東住吉区",
  "矢田北町会",
  "矢田南町会",
  "湯里町会",
  "中野町会",
  "桑津町会",
  "その他",
] as const;

export default function ProfilePage() {
  const { user } = useAuth();
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
    </div>
  );
}
