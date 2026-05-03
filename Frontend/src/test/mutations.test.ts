import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "@/hooks/queries/useDepartmentsQuery";
import {
  useCreateBaseSalaryMutation,
  useDeleteBaseSalaryMutation,
  useCreateAllowanceMutation,
  useDeleteAllowanceMutation,
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
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => vi.clearAllMocks());

// ============================================================
// Department Mutations
// ============================================================
describe("useCreateDepartmentMutation", () => {
  afterEach(() => vi.clearAllMocks());

  test("gọi POST /api/information/departments với đúng dữ liệu", async () => {
    mockApi.post.mockResolvedValueOnce({
      data: { MaPB: "PB99", TenPB: "QA" },
    });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useCreateDepartmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ MaPB: "PB99", TenPB: "QA" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApi.post).toHaveBeenCalledWith(
      "/api/information/departments",
      { MaPB: "PB99", TenPB: "QA" }
    );
  });

  test("isError khi POST thất bại", async () => {
    mockApi.post.mockRejectedValueOnce(new Error("Validation Error"));

    const { result } = renderHook(() => useCreateDepartmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({ MaPB: "PB_BAD", TenPB: "" });
      } catch {
        // expected
      }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateDepartmentMutation", () => {
  test("gọi PUT /api/information/departments/:id với đúng data", async () => {
    mockApi.put.mockResolvedValueOnce({ data: { MaPB: "PB01", TenPB: "HR" } });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useUpdateDepartmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: "PB01", data: { TenPB: "HR" } });
    });

    expect(mockApi.put).toHaveBeenCalledWith(
      "/api/information/departments/PB01",
      { TenPB: "HR" }
    );
  });
});

describe("useDeleteDepartmentMutation", () => {
  test("gọi DELETE /api/information/departments/:id", async () => {
    mockApi.delete.mockResolvedValueOnce({ data: {} });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useDeleteDepartmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("PB01");
    });

    expect(mockApi.delete).toHaveBeenCalledWith("/api/information/departments/PB01");
  });
});

// ============================================================
// Payroll Mutations
// ============================================================
describe("useCreateBaseSalaryMutation", () => {
  test("gọi POST /api/payroll/basesalary", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { MaLCB: "LCB99" } });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useCreateBaseSalaryMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ MaLCB: "LCB99", LuongCB: 9000000 });
    });

    expect(mockApi.post).toHaveBeenCalledWith("/api/payroll/basesalary", {
      MaLCB: "LCB99",
      LuongCB: 9000000,
    });
  });
});

describe("useDeleteBaseSalaryMutation", () => {
  test("gọi DELETE /api/payroll/basesalary/:id", async () => {
    mockApi.delete.mockResolvedValueOnce({ data: {} });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useDeleteBaseSalaryMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("LCB01");
    });

    expect(mockApi.delete).toHaveBeenCalledWith("/api/payroll/basesalary/LCB01");
  });
});

describe("useCreateAllowanceMutation", () => {
  test("gọi POST /api/payroll/allowances", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { MaPC: "PC99" } });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useCreateAllowanceMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ MaPC: "PC99", SoTien: 500000 });
    });

    expect(mockApi.post).toHaveBeenCalledWith("/api/payroll/allowances", {
      MaPC: "PC99",
      SoTien: 500000,
    });
  });
});

describe("useDeleteAllowanceMutation", () => {
  test("gọi DELETE /api/payroll/allowances/:id", async () => {
    mockApi.delete.mockResolvedValueOnce({ data: {} });
    mockApi.get.mockResolvedValue({ data: { data: [] } });

    const { result } = renderHook(() => useDeleteAllowanceMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("PC01");
    });

    expect(mockApi.delete).toHaveBeenCalledWith("/api/payroll/allowances/PC01");
  });
});
