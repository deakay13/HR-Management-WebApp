import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Employee } from "@/types/informationTypes/employeeTypes";

// ============================================================
// Query Key Factories
// ============================================================
export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...employeeKeys.lists(), params] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};

// ============================================================
// Types
// ============================================================


export interface EmployeesResponse {
  data: Employee[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ============================================================
// Queries (READ)
// ============================================================
export const useEmployeesQuery = (params: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async (): Promise<EmployeesResponse> => {
      // Dùng api instance (tự gắn Authorization header từ Zustand)
      const res = await api.get(`/api/information/employees`, { params });
      return Array.isArray(res.data)
        ? ({
            data: res.data,
            totalItems: res.data.length,
            totalPages: 1,
            currentPage: 1,
            pageSize: res.data.length,
          } as EmployeesResponse)
        : res.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

// ============================================================
// Mutations (WRITE)
// ============================================================
export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData | Record<string, unknown>) =>
      api.post(`/api/information/employees`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Record<string, unknown> }) =>
      api.put(`/api/information/employees/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/information/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};
