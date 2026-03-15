const DAY_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'] as const;

/**
 * 日本語の日付フォーマット（◯月◯日（曜日））
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dow = DAY_OF_WEEK[d.getDay()];
  return `${month}月${day}日（${dow}）`;
}

/**
 * 時刻フォーマット（HH:MM 形式をそのまま返す）
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * カテゴリごとのTailwindカラークラスを返す
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    // 回覧板カテゴリ
    '区役所': 'bg-blue-100 text-blue-800',
    '町会': 'bg-green-100 text-green-800',
    '防災': 'bg-red-100 text-red-800',
    '子育て': 'bg-pink-100 text-pink-800',
    'その他': 'bg-gray-100 text-gray-800',
    // イベントカテゴリ
    '地域': 'bg-indigo-100 text-indigo-800',
    '高齢者': 'bg-amber-100 text-amber-800',
    'スポーツ': 'bg-emerald-100 text-emerald-800',
  };
  return colors[category] ?? 'bg-gray-100 text-gray-800';
}

/**
 * className 結合ユーティリティ
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
