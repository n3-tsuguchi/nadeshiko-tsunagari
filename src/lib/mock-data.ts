import type { CircularNotice, Event, User } from '@/types';

// ─── ユーザー ───────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '山田 花子',
    area: '矢田北町会',
    role: 'resident',
  },
  {
    id: 'user-2',
    name: '田中 一郎',
    area: '湯里町会',
    role: 'officer',
  },
  {
    id: 'user-3',
    name: '佐藤 恵子',
    area: '東住吉区役所',
    role: 'admin',
  },
];

// ─── 電子回覧板 ─────────────────────────────────────────
export const mockCirculars: CircularNotice[] = [
  {
    id: 'circular-1',
    title: '南海トラフ地震に備えた一斉避難訓練のお知らせ',
    content:
      '4月12日（日）に東住吉区全域で一斉避難訓練を実施します。各町会の一時避難場所に午前9時までに集合してください。備蓄品の点検も併せて行います。',
    category: '防災',
    publishedAt: '2026-03-10T09:00:00',
    readBy: ['user-1'],
    isUrgent: true,
  },
  {
    id: 'circular-2',
    title: '令和8年度 町会費納入のお願い',
    content:
      '令和8年度の町会費（年額3,600円）の納入時期となりました。4月末日までに各班長へお届けください。口座振替をご希望の方は事務局までご連絡ください。',
    category: '町会',
    publishedAt: '2026-03-15T10:00:00',
    readBy: ['user-1', 'user-2'],
    isUrgent: false,
  },
  {
    id: 'circular-3',
    title: '東住吉区 子育てサロン「ぽかぽか」4月の予定',
    content:
      '4月の子育てサロンは毎週水曜日10:00〜12:00に湯里会館で開催します。0〜3歳のお子さまと保護者が対象です。予約不要・参加無料。お気軽にお越しください。',
    category: '子育て',
    publishedAt: '2026-03-18T14:00:00',
    readBy: [],
    isUrgent: false,
  },
  {
    id: 'circular-4',
    title: '区役所窓口の混雑緩和にご協力ください',
    content:
      '3月下旬〜4月上旬は転入届・転出届で窓口が大変混雑します。マイナポータルでのオンライン届出や、火曜日・木曜日の午後の来庁をお勧めします。',
    category: '区役所',
    publishedAt: '2026-03-20T08:30:00',
    readBy: ['user-2'],
    isUrgent: false,
  },
  {
    id: 'circular-5',
    title: '春の公園一斉清掃ボランティア募集',
    content:
      '4月5日（日）8:00より、矢田東公園・中野中央公園で春の一斉清掃を行います。軍手とゴミ袋は町会で用意します。多くの方のご参加をお待ちしています。',
    category: '町会',
    publishedAt: '2026-03-22T11:00:00',
    readBy: [],
    isUrgent: false,
  },
  {
    id: 'circular-6',
    title: '東住吉図書館 リニューアルオープンのご案内',
    content:
      '改修工事が完了し、4月1日にリニューアルオープンします。キッズスペースの拡充、Wi-Fi環境の整備を行いました。記念イベントも予定しています。',
    category: 'その他',
    publishedAt: '2026-03-25T09:00:00',
    readBy: ['user-1', 'user-3'],
    isUrgent: false,
  },
];

// ─── イベント ───────────────────────────────────────────
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: '第38回 東住吉区民フェスティバル',
    description:
      '模擬店、ステージ発表、スタンプラリーなど盛りだくさん！地域の団体による出店や、子ども向けの工作コーナーもあります。ご家族でお越しください。',
    date: '2026-04-19',
    startTime: '10:00',
    endTime: '15:00',
    location: '東住吉区民ホール・周辺公園',
    organizer: '東住吉区役所',
    category: '地域',
    maxParticipants: undefined,
    currentParticipants: 0,
  },
  {
    id: 'event-2',
    title: 'グラウンドゴルフ春季大会',
    description:
      '東住吉区老人クラブ連合会主催の春季大会です。初心者の方も歓迎。用具の貸し出しあり。動きやすい服装でお越しください。',
    date: '2026-04-05',
    startTime: '09:00',
    endTime: '12:00',
    location: '長居公園 自由広場',
    organizer: '東住吉区老人クラブ連合会',
    category: 'スポーツ',
    maxParticipants: 60,
    currentParticipants: 34,
  },
  {
    id: 'event-3',
    title: 'なでしこ子ども食堂',
    description:
      '温かい手作りごはんをみんなで一緒に食べましょう。子ども無料、大人300円。食材の寄付も受け付けています。',
    date: '2026-03-28',
    startTime: '17:00',
    endTime: '19:00',
    location: '湯里会館 1階調理室',
    organizer: 'なでしこ子ども食堂実行委員会',
    category: '子育て',
    maxParticipants: 40,
    currentParticipants: 28,
  },
  {
    id: 'event-4',
    title: '東住吉区総合防災訓練',
    description:
      '南海トラフ地震を想定した実践的な訓練です。起震車体験、AED講習、非常食の試食を行います。各町会ごとの集合・誘導訓練も実施します。',
    date: '2026-04-12',
    startTime: '09:00',
    endTime: '12:00',
    location: '矢田中学校 校庭',
    organizer: '東住吉区役所 防災担当',
    category: '防災',
    maxParticipants: 300,
    currentParticipants: 142,
  },
  {
    id: 'event-5',
    title: 'シニア向けスマホ教室',
    description:
      'LINEの使い方、災害時の情報収集アプリ、オンライン行政手続きなどを丁寧にお教えします。お持ちのスマートフォンをご持参ください。',
    date: '2026-04-08',
    startTime: '13:30',
    endTime: '15:30',
    location: '東住吉区民センター 第2会議室',
    organizer: '東住吉区社会福祉協議会',
    category: '高齢者',
    maxParticipants: 20,
    currentParticipants: 15,
  },
  {
    id: 'event-6',
    title: 'さくらウォーキング in 長居公園',
    description:
      '桜の季節に合わせた健康ウォーキングイベントです。約3kmのコースをゆっくり歩きます。参加者にはオリジナルタオルをプレゼント。',
    date: '2026-03-29',
    startTime: '10:00',
    endTime: '11:30',
    location: '長居公園 南入口集合',
    organizer: '東住吉区スポーツ推進委員協議会',
    category: 'スポーツ',
    maxParticipants: 50,
    currentParticipants: 37,
  },
];
