import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";
import api from "@/lib/axios";

// Mock api instance
vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

// Helper: tạo wrapper QueryClient mới cho mỗi test
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Không retry để test nhanh
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useDepartmentsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("trả về danh sách phòng ban khi API thành công", async () => {
    const mockData = {
      data: [{ MaPB: "PB01", TenPB: "IT" }],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    };
    mockApi.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () => useDepartmentsQuery({ size: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].MaPB).toBe("PB01");
  });

  test("isLoading = true khi đang fetch", async () => {
    // Delay để bắt được trạng thái loading
    mockApi.get.mockResolvedValueOnce({ data: { data: [], totalItems: 0 } });

    const { result } = renderHook(
      () => useDepartmentsQuery({}),
      { wrapper: createWrapper() }
    );

    // Ban đầu phải đang loading
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  test("isError = true khi API thất bại", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(
      () => useDepartmentsQuery({}),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  test("gọi đúng endpoint /api/information/departments", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [] } });

    const { result } = renderHook(
      () => useDepartmentsQuery({ size: 0 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/information/departments",
      expect.objectContaining({ params: { size: 0 } })
    );
  });

  test("data?.data trả về [] khi không có bản ghi", async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { data: [], totalItems: 0, totalPages: 0 },
    });

    const { result } = renderHook(
      () => useDepartmentsQuery({}),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual([]);
  });
});
