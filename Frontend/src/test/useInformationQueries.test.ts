import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";
import { useContractsQuery } from "@/hooks/queries/useContractsQuery";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => vi.clearAllMocks());

// ============================================================
// useEmployeesQuery
// ============================================================
describe("useEmployeesQuery", () => {
  test("trả về danh sách nhân viên khi API thành công (object phân trang)", async () => {
    const payload = {
      data: [{ MaNV: "NV01", HoVaTen: "Nguyễn Văn A" }],
      totalItems: 1,
    };
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useEmployeesQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data?.[0].MaNV).toBe("NV01");
  });

  test("chuyển đổi array response thành object có data + totalItems", async () => {
    const arrayPayload = [
      { MaNV: "NV01", HoVaTen: "A" },
      { MaNV: "NV02", HoVaTen: "B" },
    ];
    mockApi.get.mockResolvedValueOnce({ data: arrayPayload });

    const { result } = renderHook(() => useEmployeesQuery({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // Array response được wrap thành { data, totalItems }
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.totalItems).toBe(2);
  });

  test("gọi đúng endpoint /api/information/employees", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [] } });

    const { result } = renderHook(() => useEmployeesQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/information/employees",
      expect.objectContaining({ params: { size: 0 } })
    );
  });

  test("isError = true khi API thất bại", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("401 Unauthorized"));
    const { result } = renderHook(() => useEmployeesQuery({}), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================
// useContractsQuery
// ============================================================
describe("useContractsQuery", () => {
  test("trả về danh sách hợp đồng khi thành công", async () => {
    const payload = {
      data: [
        {
          MaHopDong: "HD01",
          MaNV: "NV01",
          LoaiHD: "Có thời hạn",
          NgayBatDau: "2026-01-01",
          ChucDanh: "Dev",
          MaPB: "PB01",
          MaLCB: "LCB01",
          MaPC: "PC01",
          HinhThucTraLuong: "Chuyển khoản",
          TinhTrang: "Còn hiệu lực",
        },
      ],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    };
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useContractsQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].MaHopDong).toBe("HD01");
  });

  test("gọi đúng endpoint /api/information/contracts", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [] } });

    const { result } = renderHook(() => useContractsQuery({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/information/contracts",
      expect.any(Object)
    );
  });

  test("data?.data fallback = [] khi không có hợp đồng", async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: [], totalItems: 0 } });

    const { result } = renderHook(() => useContractsQuery({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const contracts = result.current.data?.data ?? [];
    expect(contracts).toEqual([]);
  });

  test("isError khi API trả về lỗi", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("Server Error"));
    const { result } = renderHook(() => useContractsQuery({}), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
