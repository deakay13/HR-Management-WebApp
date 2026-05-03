import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Contract } from "@/types/informationTypes/contractTypes";

// ============================================================
// Query Key Factory
// ============================================================
export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...contractKeys.lists(), params] as const,
  detail: (id: string) => [...contractKeys.all, "detail", id] as const,
};

// ============================================================
// Types
// ============================================================

export interface ContractsResponse {
  data: Contract[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ============================================================
// Queries (READ)
// ============================================================
export const useContractsQuery = (params: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: contractKeys.list(params),
    queryFn: async (): Promise<ContractsResponse> => {
      // Dùng api instance (tự gắn Authorization header từ Zustand)
      const res = await api.get(`/api/information/contracts`, { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

// ============================================================
// Mutations (WRITE)
// ============================================================
export const useCreateContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      api.post(`/api/information/contracts`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
};

export const useUpdateContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Partial<Contract> }) =>
      api.put(`/api/information/contracts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
};

export const useDeleteContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/information/contracts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
};
