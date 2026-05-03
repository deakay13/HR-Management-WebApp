import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  useEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  employeeKeys,
} from "@/hooks/queries/useEmployeesQuery";
import { TestQueryProvider, createTestQueryClient } from "./queryTestUtils";

vi.mock("@/lib/axios");

describe("useEmployeesQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = createTestQueryClient();
  });

  describe("Queries", () => {
    test("useEmployeesQuery fetches data correctly (Array response)", async () => {
      const mockData = [{ MaNV: "NV01" }];
      vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useEmployeesQuery({ page: 1 }), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.get).toHaveBeenCalledWith("/api/information/employees", {
        params: { page: 1 },
      });
      expect(result.current.data).toEqual({
        data: mockData,
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 1,
      });
    });

    test("useEmployeesQuery fetches data correctly (Object response)", async () => {
      const mockData = { data: [{ MaNV: "NV01" }], totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 1 };
      vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useEmployeesQuery({}), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe("Mutations", () => {
    test("useCreateEmployeeMutation invalidates lists on success", async () => {
      vi.spyOn(api, "post").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateEmployeeMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      const formData = new FormData();
      formData.append("MaNV", "NV01");
      result.current.mutate(formData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.post).toHaveBeenCalledWith("/api/information/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: employeeKeys.lists() });
    });

    test("useUpdateEmployeeMutation invalidates lists on success", async () => {
      vi.spyOn(api, "put").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateEmployeeMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      const formData = new FormData();
      formData.append("TenNV", "Updated");
      result.current.mutate({ id: "NV01", data: formData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.put).toHaveBeenCalledWith("/api/information/employees/NV01", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: employeeKeys.lists() });
    });

    test("useDeleteEmployeeMutation invalidates lists on success", async () => {
      vi.spyOn(api, "delete").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteEmployeeMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      result.current.mutate("NV01");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.delete).toHaveBeenCalledWith("/api/information/employees/NV01");
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: employeeKeys.lists() });
    });
  });
});
