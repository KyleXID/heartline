import { api } from "./api";

export interface EmotionPoint {
  phase: string;
  emotion: string;
  intensity: number;
}

export interface RedFlag {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface ReplyTiming {
  recommendation: string;
  reason: string;
}

export interface SuggestedReply {
  tone: string;
  message: string;
  explanation: string;
}

export interface AnalysisResult {
  id: string;
  conversation_id: string;
  interest_score: number;
  temperature: number;
  emotion_timeline: EmotionPoint[];
  red_flags: RedFlag[];
  reply_timing_advice: ReplyTiming;
  suggested_replies: SuggestedReply[];
  created_at: string;
}

export const analysisService = {
  analyze: (conversation_id: string) =>
    api.post<AnalysisResult>("/analysis/", { conversation_id }),

  getResult: (conversation_id: string) =>
    api.get<AnalysisResult>(`/analysis/${conversation_id}`),
};
