import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  useDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  departmentKeys,
} from "@/hooks/queries/useDepartmentsQuery";
import { TestQueryProvider, createTestQueryClient } from "./queryTestUtils";

// Mock axios
vi.mock("@/lib/axios");

describe("useDepartmentsQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = createTestQueryClient();
  });

  describe("Queries", () => {
    test("useDepartmentsQuery fetches data correctly", async () => {
      const mockData = { data: [{ MaPB: "P01", TenPB: "IT" }], totalItems: 1 };
      vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useDepartmentsQuery({ page: 1 }), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.get).toHaveBeenCalledWith("/api/information/departments", {
        params: { page: 1 },
      });
      expect(result.current.data).toEqual(mockData);
    });

    test("useDepartmentsQuery respects enabled option", () => {
      const { result } = renderHook(() => useDepartmentsQuery({}, { enabled: false }), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("Mutations", () => {
    test("useCreateDepartmentMutation invalidates lists on success", async () => {
      vi.spyOn(api, "post").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateDepartmentMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      result.current.mutate({ MaPB: "P01", TenPB: "HR" });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.post).toHaveBeenCalledWith("/api/information/departments", { MaPB: "P01", TenPB: "HR" });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: departmentKeys.lists() });
    });

    test("useUpdateDepartmentMutation invalidates lists on success", async () => {
      vi.spyOn(api, "put").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateDepartmentMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      result.current.mutate({ id: "P01", data: { TenPB: "HR Updated" } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.put).toHaveBeenCalledWith("/api/information/departments/P01", { TenPB: "HR Updated" });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: departmentKeys.lists() });
    });

    test("useDeleteDepartmentMutation invalidates lists on success", async () => {
      vi.spyOn(api, "delete").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteDepartmentMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      result.current.mutate("P01");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.delete).toHaveBeenCalledWith("/api/information/departments/P01");
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: departmentKeys.lists() });
    });
  });
});
