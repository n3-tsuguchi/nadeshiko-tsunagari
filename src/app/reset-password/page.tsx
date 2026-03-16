"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("パスワードが一致しません。");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("パスワードの更新に失敗しました: " + error.message);
    } else {
      setMessage("パスワードを更新しました。ログインしてください。");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">
            なでしこつながり
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-center mb-6">
            新しいパスワードを設定
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-base">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-base">
              {message}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              新しいパスワード
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="6文字以上"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              パスワード確認
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="もう一度入力"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "更新中..." : "パスワードを更新"}
          </Button>
        </form>
      </div>
    </div>
  );
}
