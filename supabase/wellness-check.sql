-- げんき確認テーブル
CREATE TABLE IF NOT EXISTS public.wellness_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('genki', 'sukoshi', 'tsurai')),
  checked_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, checked_at)
);

-- RLSポリシー
ALTER TABLE public.wellness_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read wellness_checks"
ON public.wellness_checks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert own wellness_checks"
ON public.wellness_checks FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update own wellness_checks"
ON public.wellness_checks FOR UPDATE TO authenticated
USING (true);
