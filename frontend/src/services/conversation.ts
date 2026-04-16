import { api, uploadFiles } from "./api";

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

export interface ImageUploadResponse {
  uploaded: number;
  images: ConversationImage[];
}

export const conversationService = {
  get: (id: string) => api.get<Conversation>(`/conversations/${id}`),
  create: (targetId: string) =>
    api.post<Conversation>("/conversations/", { target_id: targetId }),
  uploadImages: (conversationId: string, files: File[]) =>
    uploadFiles<ImageUploadResponse>(
      `/conversations/${conversationId}/images`,
      files,
      "files",
    ),
  getStatus: (id: string) => api.get<Conversation>(`/conversations/${id}`),
  list: () => api.get<ConversationWithScore[]>("/conversations/"),
  deleteImages: (conversationId: string) =>
    api.delete<{ deleted: number; message: string }>(
      `/conversations/${conversationId}/images`,
    ),
};
