import { api } from "./api";

export interface ConversationImage {
  id: string;
  image_file: string;
  order: number;
  ocr_text: string | null;
}

export interface Conversation {
  id: string;
  user_id: string;
  target_id: string;
  status: string;
  created_at: string;
  images: ConversationImage[];
}

export interface ConversationWithScore extends Conversation {
  interest_score?: number;
  target_nickname?: string;
}

export const conversationService = {
  get: (id: string) => api.get<Conversation>(`/conversations/${id}`),
};
