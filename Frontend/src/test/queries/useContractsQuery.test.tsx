import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  useContractsQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  contractKeys,
} from "@/hooks/queries/useContractsQuery";
import { TestQueryProvider, createTestQueryClient } from "./queryTestUtils";

vi.mock("@/lib/axios");

describe("useContractsQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = createTestQueryClient();
  });

  describe("Queries", () => {
    test("useContractsQuery fetches data correctly", async () => {
      const mockData = { data: [{ MaHD: "HD01" }], totalItems: 1 };
      vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useContractsQuery({ page: 1 }), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.get).toHaveBeenCalledWith("/api/information/contracts", {
        params: { page: 1 },
      });
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe("Mutations", () => {
    test("useCreateContractMutation invalidates lists on success", async () => {
      vi.spyOn(api, "post").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateContractMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      const formData = new FormData();
      formData.append("MaHD", "HD01");
      result.current.mutate(formData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.post).toHaveBeenCalledWith("/api/information/contracts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
    });

    test("useUpdateContractMutation invalidates lists on success", async () => {
      vi.spyOn(api, "put").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateContractMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      result.current.mutate({ id: "HD01", data: { LoaiHD: "Fulltime" } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.put).toHaveBeenCalledWith("/api/information/contracts/HD01", { LoaiHD: "Fulltime" });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
    });

    test("useDeleteContractMutation invalidates lists on success", async () => {
      vi.spyOn(api, "delete").mockResolvedValue({ data: { message: "OK" } });
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteContractMutation(), {
        wrapper: ({ children }) => <TestQueryProvider client={queryClient}>{children}</TestQueryProvider>,
      });

      result.current.mutate("HD01");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.delete).toHaveBeenCalledWith("/api/information/contracts/HD01");
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
    });
  });
});
