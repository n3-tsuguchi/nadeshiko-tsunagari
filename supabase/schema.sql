-- ============================================
-- なでしこつながり データベーススキーマ
-- Supabase SQL Editor で実行してください
-- ============================================

-- 1. profiles テーブル（ユーザープロフィール）
create table if not exists profiles (
  id uuid primary key,
  name text not null,
  area text not null default '東住吉区',
  role text not null default 'resident' check (role in ('resident', 'officer', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 2. circulars テーブル（回覧板）
create table if not exists circulars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null check (category in ('区役所', '町会', '防災', '子育て', 'その他')),
  published_at timestamptz not null default now(),
  attachment_url text,
  is_urgent boolean not null default false,
  author_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 3. circular_reads テーブル（既読管理）
create table if not exists circular_reads (
  id uuid primary key default gen_random_uuid(),
  circular_id uuid not null references circulars(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (circular_id, user_id)
);

-- 4. events テーブル（イベント）
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  location text not null,
  organizer text not null,
  category text not null check (category in ('地域', '子育て', '高齢者', '防災', 'スポーツ', 'その他')),
  max_participants integer,
  image_url text,
  author_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 5. event_participations テーブル（イベント参加）
create table if not exists event_participations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ============================================
-- インデックス
-- ============================================
create index if not exists idx_circulars_published_at on circulars(published_at desc);
create index if not exists idx_circulars_category on circulars(category);
create index if not exists idx_circular_reads_user on circular_reads(user_id);
create index if not exists idx_circular_reads_circular on circular_reads(circular_id);
create index if not exists idx_events_date on events(date);
create index if not exists idx_event_participations_user on event_participations(user_id);
create index if not exists idx_event_participations_event on event_participations(event_id);

-- ============================================
-- RLS（Row Level Security）ポリシー
-- ============================================

-- profiles
alter table profiles enable row level security;
create policy "誰でもプロフィールを閲覧可能" on profiles for select using (true);
create policy "本人のみプロフィールを更新可能" on profiles for update using (auth.uid() = id);

-- circulars
alter table circulars enable row level security;
create policy "誰でも回覧板を閲覧可能" on circulars for select using (true);
create policy "役員・管理者のみ回覧板を作成可能" on circulars for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('officer', 'admin')
    )
  );

-- circular_reads
alter table circular_reads enable row level security;
create policy "本人の既読情報を閲覧可能" on circular_reads for select using (auth.uid() = user_id);
create policy "本人のみ既読を登録可能" on circular_reads for insert with check (auth.uid() = user_id);
create policy "本人のみ既読を削除可能" on circular_reads for delete using (auth.uid() = user_id);

-- events
alter table events enable row level security;
create policy "誰でもイベントを閲覧可能" on events for select using (true);
create policy "役員・管理者のみイベントを作成可能" on events for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('officer', 'admin')
    )
  );

-- event_participations
alter table event_participations enable row level security;
create policy "本人の参加情報を閲覧可能" on event_participations for select using (auth.uid() = user_id);
create policy "イベント参加者数は誰でも集計可能" on event_participations for select using (true);
create policy "本人のみ参加登録可能" on event_participations for insert with check (auth.uid() = user_id);
create policy "本人のみ参加取消可能" on event_participations for delete using (auth.uid() = user_id);
