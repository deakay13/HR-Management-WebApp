import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useAllowancesQuery,
  useBaseSalariesQuery,
  useDeductionsQuery,
  useHoursQuery,
  usePayrollsQuery,
} from "@/hooks/queries/usePayrollQueries";
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

const mockPaginated = (rows: unknown[] = []) => ({
  data: rows,
  totalItems: rows.length,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
});

beforeEach(() => vi.clearAllMocks());

// ============================================================
// useAllowancesQuery
// ============================================================
describe("useAllowancesQuery", () => {
  test("trả về danh sách phụ cấp khi thành công", async () => {
    const payload = mockPaginated([{ MaPC: "PC01", TenPC: "Ăn trưa" }]);
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useAllowancesQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/payroll/allowances",
      expect.objectContaining({ params: { size: 0 } })
    );
  });

  test("isError khi API thất bại", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("Server Error"));
    const { result } = renderHook(() => useAllowancesQuery({}), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================
// useBaseSalariesQuery
// ============================================================
describe("useBaseSalariesQuery", () => {
  test("trả về lương cơ bản khi thành công", async () => {
    const payload = mockPaginated([{ MaLCB: "LCB01", LuongCB: 8000000 }]);
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useBaseSalariesQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data[0]).toMatchObject({ MaLCB: "LCB01" });
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/payroll/basesalary",
      expect.any(Object)
    );
  });
});

// ============================================================
// useDeductionsQuery
// ============================================================
describe("useDeductionsQuery", () => {
  test("trả về danh sách khấu trừ khi thành công", async () => {
    const payload = mockPaginated([{ MaKT: "KT01", LoaiKT: "BHXH" }]);
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useDeductionsQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/payroll/deductions",
      expect.any(Object)
    );
  });
});

// ============================================================
// useHoursQuery
// ============================================================
describe("useHoursQuery", () => {
  test("trả về giờ làm khi thành công", async () => {
    const payload = mockPaginated([{ MaGL: "GL01", SoGioLam: 8 }]);
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => useHoursQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data[0]).toMatchObject({ MaGL: "GL01" });
  });
});

// ============================================================
// usePayrollsQuery
// ============================================================
describe("usePayrollsQuery", () => {
  test("gọi endpoint /api/payroll/payrolls khi không có employeeId", async () => {
    const payload = mockPaginated([{ MaBL: "BL01", TongLuong: 10000000 }]);
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(() => usePayrollsQuery({ size: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/payroll/payrolls",
      expect.any(Object)
    );
  });

  test("gọi endpoint theo nhân viên khi có employeeId", async () => {
    const payload = mockPaginated([{ MaBL: "BL01", MaNV: "NV01" }]);
    mockApi.get.mockResolvedValueOnce({ data: payload });

    const { result } = renderHook(
      () => usePayrollsQuery({}, { employeeId: "NV01" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.get).toHaveBeenCalledWith(
      "/api/payroll/payrolls/employee/NV01",
      expect.any(Object)
    );
  });

  test("data?.data mặc định là [] khi không có bản ghi", async () => {
    mockApi.get.mockResolvedValueOnce({ data: mockPaginated([]) });

    const { result } = renderHook(() => usePayrollsQuery({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual([]);
  });
});
