export type CircularNotice = {
  id: string;
  title: string;
  content: string;
  category: '区役所' | '町会' | '防災' | '子育て' | 'その他';
  publishedAt: string;
  readBy: string[];
  attachmentUrl?: string;
  isUrgent: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  category: '地域' | '子育て' | '高齢者' | '防災' | 'スポーツ' | 'その他';
  maxParticipants?: number;
  currentParticipants: number;
  imageUrl?: string;
};

export type User = {
  id: string;
  name: string;
  area: string;
  role: 'resident' | 'officer' | 'admin';
  avatarUrl?: string;
};
