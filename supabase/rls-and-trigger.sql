-- ============================================
-- #1 RLSポリシー再設定（認証ユーザー対応）
-- #2 新規登録時のプロフィール自動作成トリガー
-- Supabase SQL Editor で実行してください
-- ============================================

-- 既存ポリシーを削除
DROP POLICY IF EXISTS "誰でもプロフィールを閲覧可能" ON profiles;
DROP POLICY IF EXISTS "本人のみプロフィールを更新可能" ON profiles;
DROP POLICY IF EXISTS "誰でも回覧板を閲覧可能" ON circulars;
DROP POLICY IF EXISTS "役員・管理者のみ回覧板を作成可能" ON circulars;
DROP POLICY IF EXISTS "本人の既読情報を閲覧可能" ON circular_reads;
DROP POLICY IF EXISTS "本人のみ既読を登録可能" ON circular_reads;
DROP POLICY IF EXISTS "本人のみ既読を削除可能" ON circular_reads;
DROP POLICY IF EXISTS "誰でもイベントを閲覧可能" ON events;
DROP POLICY IF EXISTS "役員・管理者のみイベントを作成可能" ON events;
DROP POLICY IF EXISTS "本人の参加情報を閲覧可能" ON event_participations;
DROP POLICY IF EXISTS "イベント参加者数は誰でも集計可能" ON event_participations;
DROP POLICY IF EXISTS "本人のみ参加登録可能" ON event_participations;
DROP POLICY IF EXISTS "本人のみ参加取消可能" ON event_participations;

-- RLS有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulars ENABLE ROW LEVEL SECURITY;
ALTER TABLE circular_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participations ENABLE ROW LEVEL SECURITY;

-- profiles ポリシー
CREATE POLICY "認証ユーザーはプロフィールを閲覧可能"
  ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "本人のみプロフィールを更新可能"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "プロフィール作成を許可"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- circulars ポリシー
CREATE POLICY "認証ユーザーは回覧板を閲覧可能"
  ON circulars FOR SELECT TO authenticated USING (true);
CREATE POLICY "認証ユーザーは回覧板を作成可能"
  ON circulars FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- circular_reads ポリシー
CREATE POLICY "認証ユーザーは既読情報を閲覧可能"
  ON circular_reads FOR SELECT TO authenticated USING (true);
CREATE POLICY "本人のみ既読を登録可能"
  ON circular_reads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "本人のみ既読を削除可能"
  ON circular_reads FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- events ポリシー
CREATE POLICY "認証ユーザーはイベントを閲覧可能"
  ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "認証ユーザーはイベントを作成可能"
  ON events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- event_participations ポリシー
CREATE POLICY "認証ユーザーは参加情報を閲覧可能"
  ON event_participations FOR SELECT TO authenticated USING (true);
CREATE POLICY "本人のみ参加登録可能"
  ON event_participations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "本人のみ参加取消可能"
  ON event_participations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- #2 新規登録時にprofilesへ自動INSERTするトリガー
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, area, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    '東住吉区',
    'resident'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
