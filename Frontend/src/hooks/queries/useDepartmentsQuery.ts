import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Department } from "@/types/informationTypes/departmentTypes";

// ============================================================

// Query Key Factory (giúp quản lý key tập trung, dễ invalidate)
// ============================================================
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...departmentKeys.lists(), params] as const,
  detail: (id: string) => [...departmentKeys.all, "detail", id] as const,
};

// ============================================================
// Types
// ============================================================

export interface DepartmentsResponse {
  data: Department[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ============================================================
// Queries (READ)
// ============================================================
export const useDepartmentsQuery = (
  params: Record<string, unknown> = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: async (): Promise<DepartmentsResponse> => {
      const res = await api.get(`/api/information/departments`, {
        params,
      });
      return res.data;
    },
    enabled: options?.enabled !== false, // default true
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

// ============================================================
// Mutations (WRITE) - Tự động Invalidate cache sau khi ghi
// ============================================================
export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { MaPB: string; TenPB: string }) =>
      api.post(`/api/information/departments`, data),
    onSuccess: () => {
      // Invalidate toàn bộ cache departments → tự động refetch
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
      api.put(`/api/information/departments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/information/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};
