import { api } from "./api";

export interface Target {
  id: string;
  nickname: string;
  memo: string | null;
  relationship_goal: string | null;
  created_at: string;
}

interface TargetCreate {
  nickname: string;
  memo?: string;
  relationship_goal?: string;
}

export const targetService = {
  list: () => api.get<Target[]>("/targets/"),
  create: (data: TargetCreate) => api.post<Target>("/targets/", data),
  update: (id: string, data: Partial<TargetCreate>) =>
    api.patch<Target>(`/targets/${id}`, data),
  remove: (id: string) => api.delete(`/targets/${id}`),
};
