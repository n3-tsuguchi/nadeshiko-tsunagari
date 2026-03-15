"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split("@")[0],
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "確認メールを送信しました。メールのリンクをクリックしてください。"
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("メールアドレスまたはパスワードが正しくありません。");
      } else {
        window.location.href = "/";
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">
            なでしこつながり
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            東住吉区 地域活動支援アプリ
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-center mb-6">
            {isSignUp ? "新規登録" : "ログイン"}
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
              htmlFor="email"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="6文字以上"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading
              ? "処理中..."
              : isSignUp
                ? "新規登録"
                : "ログイン"}
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setMessage("");
              }}
              className="text-base text-pink-600 hover:underline cursor-pointer"
            >
              {isSignUp
                ? "すでにアカウントをお持ちの方はこちら"
                : "新規登録はこちら"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
