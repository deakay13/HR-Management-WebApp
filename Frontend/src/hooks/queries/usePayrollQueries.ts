import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// ============================================================
// Query Key Factories
// ============================================================
export const baseSalaryKeys = {
  all: ["baseSalaries"] as const,
  lists: () => [...baseSalaryKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...baseSalaryKeys.lists(), params] as const,
};

export const allowanceKeys = {
  all: ["allowances"] as const,
  lists: () => [...allowanceKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...allowanceKeys.lists(), params] as const,
};

export const deductionKeys = {
  all: ["deductions"] as const,
  lists: () => [...deductionKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...deductionKeys.lists(), params] as const,
};

export const hoursKeys = {
  all: ["hours"] as const,
  lists: () => [...hoursKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...hoursKeys.lists(), params] as const,
};

export const payrollKeys = {
  all: ["payrolls"] as const,
  lists: () => [...payrollKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...payrollKeys.lists(), params] as const,
};

// ============================================================
// Shared Interface Response
// ============================================================
interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ============================================================
// Queries (READ) — dùng api instance để tự gắn Authorization header
// ============================================================
export const useBaseSalariesQuery = (params: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: baseSalaryKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const res = await api.get(`/api/payroll/basesalary`, { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

export const useAllowancesQuery = (params: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: allowanceKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const res = await api.get(`/api/payroll/allowances`, { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

export const useDeductionsQuery = (params: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: deductionKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const res = await api.get(`/api/payroll/deductions`, { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

export const useHoursQuery = (params: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: hoursKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const res = await api.get(`/api/payroll/hours`, { params });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

export const usePayrollsQuery = (
  params: Record<string, unknown> = {}
) =>
  useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const res = await api.get(`/api/payroll/payrolls`, { params });
      return res.data;
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

// ============================================================
// Mutations (WRITE) — tự gắn auth header qua api instance
// ============================================================
export const useCreateBaseSalaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(`/api/payroll/basesalary`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: baseSalaryKeys.lists() }),
  });
};

export const useUpdateBaseSalaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/payroll/basesalary/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: baseSalaryKeys.lists() }),
  });
};

export const useDeleteBaseSalaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/payroll/basesalary/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: baseSalaryKeys.lists() }),
  });
};

export const useCreateAllowanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(`/api/payroll/allowances`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: allowanceKeys.lists() }),
  });
};

export const useUpdateAllowanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/payroll/allowances/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: allowanceKeys.lists() }),
  });
};

export const useDeleteAllowanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/payroll/allowances/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: allowanceKeys.lists() }),
  });
};

export const useCreateDeductionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(`/api/payroll/deductions`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deductionKeys.lists() }),
  });
};

export const useUpdateDeductionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/payroll/deductions/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deductionKeys.lists() }),
  });
};

export const useDeleteDeductionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/payroll/deductions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deductionKeys.lists() }),
  });
};

export const useCreateHourMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(`/api/payroll/hours`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hoursKeys.lists() }),
  });
};

export const useUpdateHourMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/payroll/hours/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hoursKeys.lists() }),
  });
};

export const useDeleteHourMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/payroll/hours/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hoursKeys.lists() }),
  });
};

export const useCreatePayrollMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(`/api/payroll/payrolls`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payrollKeys.lists() }),
  });
};

export const useUpdatePayrollMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/payroll/payrolls/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payrollKeys.lists() }),
  });
};

export const useDeletePayrollMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/payroll/payrolls/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payrollKeys.lists() }),
  });
};
