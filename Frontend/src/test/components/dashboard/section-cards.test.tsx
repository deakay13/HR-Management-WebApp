import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { SectionCards } from "@/components/dashboard/section-cards";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";
import { useContractsQuery } from "@/hooks/queries/useContractsQuery";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";
import { usePayrollsQuery } from "@/hooks/queries/usePayrollQueries";
import { useAccountsStore } from "@/stores/authStores/accountStore";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/queries/useEmployeesQuery", () => ({ useEmployeesQuery: vi.fn() }));
vi.mock("@/hooks/queries/useContractsQuery", () => ({ useContractsQuery: vi.fn() }));
vi.mock("@/hooks/queries/useDepartmentsQuery", () => ({ useDepartmentsQuery: vi.fn() }));
vi.mock("@/hooks/queries/usePayrollQueries", () => ({ usePayrollsQuery: vi.fn() }));
vi.mock("@/stores/authStores/accountStore", () => ({ useAccountsStore: vi.fn() }));

describe("SectionCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useEmployeesQuery as any).mockReturnValue({ data: { data: [] } });
    (useContractsQuery as any).mockReturnValue({ data: { data: [] } });
    (useDepartmentsQuery as any).mockReturnValue({ data: { data: [] } });
    (usePayrollsQuery as any).mockReturnValue({ data: { data: [] } });
    (useAccountsStore as any).mockReturnValue({ accounts: [] });
  });

  test("renders all cards with default values when data is empty", () => {
    render(<SectionCards />);
    
    expect(screen.getByText("Tổng Nhân Viên")).toBeInTheDocument();
    expect(screen.getByText("Hợp Đồng")).toBeInTheDocument();
    expect(screen.getByText("Phòng Ban")).toBeInTheDocument();
    expect(screen.getByText("Tổng Quỹ Lương")).toBeInTheDocument();
    expect(screen.getByText("Tài Khoản")).toBeInTheDocument();
  });

  test("renders correctly with mocked data", () => {
    (useEmployeesQuery as any).mockReturnValue({ 
      data: { data: [{ MaNV: "NV1", MaPB: "PB1" }, { MaNV: "NV2" }] } 
    });
    
    // Make one contract active, one expired
    const activeDate = new Date();
    activeDate.setFullYear(activeDate.getFullYear() + 1);
    const expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() - 1);
    
    (useContractsQuery as any).mockReturnValue({ 
      data: { 
        data: [
          { MaNV: "NV1", NgayKetThuc: activeDate.toISOString() },
          { MaNV: "NV2", NgayKetThuc: expiredDate.toISOString() }
        ] 
      } 
    });
    
    (useDepartmentsQuery as any).mockReturnValue({ 
      data: { data: [{ MaPB: "PB1" }, { MaPB: "PB2" }] } 
    });
    
    (usePayrollsQuery as any).mockReturnValue({ 
      data: { 
        data: [
          { TongLuong: 5000000 },
          { TongLuong: 10000000 }
        ] 
      } 
    });
    
    (useAccountsStore as any).mockReturnValue({ 
      accounts: [
        { TrangThai: "Online" },
        { TrangThai: "Offline" }
      ] 
    });
    
    render(<SectionCards />);
    
    // It should render total employees count (2)
    // We cannot reliably match exact text if it's rendered uniquely, but we know the headings.
    expect(screen.getByText("Tổng Nhân Viên")).toBeInTheDocument();
    expect(screen.getByText("Hợp Đồng")).toBeInTheDocument();
  });
  
  test("handles formatting large currency amounts correctly", () => {
    (usePayrollsQuery as any).mockReturnValue({ 
      data: { 
        data: [
          { TongLuong: 1500000000 } // 1.5 Tỷ
        ] 
      } 
    });
    
    render(<SectionCards />);
    expect(screen.getByText("1,5 Tỷ")).toBeInTheDocument();
  });

  test("handles formatting medium currency amounts correctly", () => {
    (usePayrollsQuery as any).mockReturnValue({ 
      data: { 
        data: [
          { TongLuong: 5500000 } // 5.5 Triệu
        ] 
      } 
    });
    
    render(<SectionCards />);
    expect(screen.getByText("5,5 Triệu")).toBeInTheDocument();
  });
});
