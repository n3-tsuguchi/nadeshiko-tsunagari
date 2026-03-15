"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardBody } from "@/components/ui/card";

type Profile = {
  id: string;
  name: string;
  area: string;
  role: "resident" | "officer" | "admin";
};

const ROLE_LABELS: Record<string, string> = {
  resident: "住民",
  officer: "役員",
  admin: "管理者",
};

const ROLE_COLORS: Record<string, string> = {
  resident: "bg-gray-100 text-gray-700",
  officer: "bg-blue-100 text-blue-700",
  admin: "bg-pink-100 text-pink-700",
};

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, name, area, role")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setProfiles(data as Profile[]);
        setLoading(false);
      });
  }, []);

  const handleRoleChange = async (userId: string, newRole: Profile["role"]) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === userId ? { ...p, role: newRole } : p
        )
      );
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

      <h1 className="mt-4 text-2xl font-bold text-gray-900">ユーザー管理</h1>
      <p className="mt-1 text-base text-gray-600">
        ユーザーの役割を変更できます
      </p>

      {loading ? (
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardBody>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {profile.name}
                    </p>
                    <p className="text-base text-gray-500">{profile.area}</p>
                  </div>
                  <select
                    value={profile.role}
                    onChange={(e) =>
                      handleRoleChange(profile.id, e.target.value as Profile["role"])
                    }
                    className={[
                      "shrink-0 rounded-lg px-3 py-2 text-base font-medium border border-gray-300",
                      "focus:outline-none focus:ring-2 focus:ring-pink-500",
                      ROLE_COLORS[profile.role],
                    ].join(" ")}
                  >
                    <option value="resident">住民</option>
                    <option value="officer">役員</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
                <span
                  className={`mt-2 inline-block px-2 py-0.5 rounded-full text-sm font-medium ${ROLE_COLORS[profile.role]}`}
                >
                  {ROLE_LABELS[profile.role]}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
