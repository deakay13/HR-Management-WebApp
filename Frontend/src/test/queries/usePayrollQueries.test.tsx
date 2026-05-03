import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  useBaseSalariesQuery,
  useAllowancesQuery,
  useDeductionsQuery,
  useHoursQuery,
  usePayrollsQuery,
  useCreateBaseSalaryMutation,
  useUpdateBaseSalaryMutation,
  useDeleteBaseSalaryMutation,
  useCreateAllowanceMutation,
  useUpdateAllowanceMutation,
  useDeleteAllowanceMutation,
  useCreateDeductionMutation,
  useUpdateDeductionMutation,
  useDeleteDeductionMutation,
  useCreateHourMutation,
  useUpdateHourMutation,
  useDeleteHourMutation,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useDeletePayrollMutation,
  baseSalaryKeys,
  allowanceKeys,
  deductionKeys,
  hoursKeys,
  payrollKeys,
} from "@/hooks/queries/usePayrollQueries";
import { TestQueryProvider, createTestQueryClient } from "./queryTestUtils";

vi.mock("@/lib/axios");

describe("usePayrollQueries", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = createTestQueryClient();
  });

  describe("Queries", () => {
    const queries = [
      { name: "useBaseSalariesQuery", hook: useBaseSalariesQuery, url: "/api/payroll/basesalary" },
      { name: "useAllowancesQuery", hook: useAllowancesQuery, url: "/api/payroll/allowances" },
      { name: "useDeductionsQuery", hook: useDeductionsQuery, url: "/api/payroll/deductions" },
      { name: "useHoursQuery", hook: useHoursQuery, url: "/api/payroll/hours" },
    ];

    queries.forEach(({ name, hook, url }) => {
      test(`${name} fetches data correctly`, async () => {
        const mockData = { data: [{ id: "1" }], totalItems: 1 };
        vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

        const { result } = renderHook(() => hook({ page: 1 }), {
          wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(api.get).toHaveBeenCalledWith(url, { params: { page: 1 } });
        expect(result.current.data).toEqual(mockData);
      });
    });

    test("usePayrollsQuery fetches data correctly without employeeId", async () => {
      const mockData = { data: [{ id: "1" }], totalItems: 1 };
      vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => usePayrollsQuery({ page: 1 }), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.get).toHaveBeenCalledWith("/api/payroll/payrolls", { params: { page: 1 } });
      expect(result.current.data).toEqual(mockData);
    });

    test("usePayrollsQuery fetches data correctly with employeeId", async () => {
      const mockData = { data: [{ id: "1" }], totalItems: 1 };
      vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => usePayrollsQuery({ page: 1 }, { employeeId: "NV01" }), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.get).toHaveBeenCalledWith("/api/payroll/payrolls/employee/NV01", { params: { page: 1 } });
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe("Mutations", () => {
    const creates = [
      { name: "useCreateBaseSalaryMutation", hook: useCreateBaseSalaryMutation, url: "/api/payroll/basesalary", keys: baseSalaryKeys },
      { name: "useCreateAllowanceMutation", hook: useCreateAllowanceMutation, url: "/api/payroll/allowances", keys: allowanceKeys },
      { name: "useCreateDeductionMutation", hook: useCreateDeductionMutation, url: "/api/payroll/deductions", keys: deductionKeys },
      { name: "useCreateHourMutation", hook: useCreateHourMutation, url: "/api/payroll/hours", keys: hoursKeys },
      { name: "useCreatePayrollMutation", hook: useCreatePayrollMutation, url: "/api/payroll/payrolls", keys: payrollKeys },
    ];

    creates.forEach(({ name, hook, url, keys }) => {
      test(`${name} invalidates lists on success`, async () => {
        vi.spyOn(api, "post").mockResolvedValue({ data: { message: "OK" } });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const { result } = renderHook(() => hook(), {
          wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
        });

        result.current.mutate({ id: "1" });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.post).toHaveBeenCalledWith(url, { id: "1" });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: keys.lists() });
      });
    });

    const updates = [
      { name: "useUpdateBaseSalaryMutation", hook: useUpdateBaseSalaryMutation, url: "/api/payroll/basesalary", keys: baseSalaryKeys },
      { name: "useUpdateAllowanceMutation", hook: useUpdateAllowanceMutation, url: "/api/payroll/allowances", keys: allowanceKeys },
      { name: "useUpdateDeductionMutation", hook: useUpdateDeductionMutation, url: "/api/payroll/deductions", keys: deductionKeys },
      { name: "useUpdateHourMutation", hook: useUpdateHourMutation, url: "/api/payroll/hours", keys: hoursKeys },
      { name: "useUpdatePayrollMutation", hook: useUpdatePayrollMutation, url: "/api/payroll/payrolls", keys: payrollKeys },
    ];

    updates.forEach(({ name, hook, url, keys }) => {
      test(`${name} invalidates lists on success`, async () => {
        vi.spyOn(api, "put").mockResolvedValue({ data: { message: "OK" } });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const { result } = renderHook(() => hook(), {
          wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
        });

        result.current.mutate({ id: "1", data: { val: 2 } });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.put).toHaveBeenCalledWith(`${url}/1`, { val: 2 });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: keys.lists() });
      });
    });

    const deletes = [
      { name: "useDeleteBaseSalaryMutation", hook: useDeleteBaseSalaryMutation, url: "/api/payroll/basesalary", keys: baseSalaryKeys },
      { name: "useDeleteAllowanceMutation", hook: useDeleteAllowanceMutation, url: "/api/payroll/allowances", keys: allowanceKeys },
      { name: "useDeleteDeductionMutation", hook: useDeleteDeductionMutation, url: "/api/payroll/deductions", keys: deductionKeys },
      { name: "useDeleteHourMutation", hook: useDeleteHourMutation, url: "/api/payroll/hours", keys: hoursKeys },
      { name: "useDeletePayrollMutation", hook: useDeletePayrollMutation, url: "/api/payroll/payrolls", keys: payrollKeys },
    ];

    deletes.forEach(({ name, hook, url, keys }) => {
      test(`${name} invalidates lists on success`, async () => {
        vi.spyOn(api, "delete").mockResolvedValue({ data: { message: "OK" } });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const { result } = renderHook(() => hook(), {
          wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
        });

        result.current.mutate("1");
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(api.delete).toHaveBeenCalledWith(`${url}/1`);
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: keys.lists() });
      });
    });
  });
});
