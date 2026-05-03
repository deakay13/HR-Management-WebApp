import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { columns as allowancesColumns } from "@/components/table/columns/workspace/allowancesColumns";
import { columns as baseSalaryColumns } from "@/components/table/columns/workspace/baseSalaryColumns";
import { columns as deductionColumns } from "@/components/table/columns/workspace/deductionColumns";
import { columns as hoursColumns } from "@/components/table/columns/workspace/hoursColumns";
import { columns as payRollColumns } from "@/components/table/columns/workspace/payRollColumns";
import i18n from "@/i18n";
import { MemoryRouter } from "react-router-dom";

vi.spyOn(i18n, "t").mockImplementation((key: string, options?: any) => {
  if (options?.count !== undefined) {
    return `${options.count} VND`;
  }
  return key;
});

// Mock ActionCells
vi.mock("@/components/actionCells/workspace/AllowanceActionCell", () => ({
  AllowanceActionCell: () => <div data-testid="action-cell">Action</div>,
}));
vi.mock("@/components/actionCells/workspace/BaseSalaryActionCell", () => ({
  BaseSalaryActionCell: () => <div data-testid="action-cell">Action</div>,
}));
vi.mock("@/components/actionCells/workspace/DeductionActionCell", () => ({
  DeductionActionCell: () => <div data-testid="action-cell">Action</div>,
}));
vi.mock("@/components/actionCells/workspace/HoursActionCell", () => ({
  HoursActionCell: () => <div data-testid="action-cell">Action</div>,
}));
vi.mock("@/components/actionCells/workspace/PayrollActionCell", () => ({
  PayRollActionCell: () => <div data-testid="action-cell">Action</div>,
}));

const renderCell = (columnDef: any, row: any) => {
  if (typeof columnDef.cell === "function") {
    return render(
      <MemoryRouter>
        {columnDef.cell({ row: { original: row } })}
      </MemoryRouter>
    );
  }
  return null;
};

describe("Workspace Columns", () => {
  // ===== allowancesColumns =====
  // [0]=MaPC, [1]=LoaiPC, [2]=SoTien, [3]=actions
  test("allowancesColumns - cell MaPC renders", () => {
    renderCell(allowancesColumns[0], { MaPC: "PC01", LoaiPC: "Xăng xe", SoTien: 500000 });
    expect(screen.getByText("PC01")).toBeInTheDocument();
  });

  test("allowancesColumns - cell LoaiPC renders", () => {
    renderCell(allowancesColumns[1], { MaPC: "PC01", LoaiPC: "Xăng xe", SoTien: 500000 });
    expect(screen.getByText("Xăng xe")).toBeInTheDocument();
  });

  test("allowancesColumns - cell SoTien renders formatted currency", () => {
    renderCell(allowancesColumns[2], { MaPC: "PC01", LoaiPC: "Xăng xe", SoTien: 500000 });
    // t("{{count}} VND", { count: "500.000" }) → "500.000 VND"
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  // ===== baseSalaryColumns =====
  // [0]=MaLCB, [1]=LuongCB, [2]=actions
  test("baseSalaryColumns - cell MaLCB renders", () => {
    renderCell(baseSalaryColumns[0], { MaLCB: "LCB01", LuongCB: 5000000 });
    expect(screen.getByText("LCB01")).toBeInTheDocument();
  });

  test("baseSalaryColumns - cell LuongCB renders formatted currency", () => {
    renderCell(baseSalaryColumns[1], { MaLCB: "LCB01", LuongCB: 5000000 });
    // toLocaleString("vi-VN") → "5.000.000" → "5.000.000 VND"
    expect(screen.getByText(/5\.000\.000 VND/)).toBeInTheDocument();
  });

  // ===== deductionColumns =====
  // [0]=MaKT, [1]=LoaiKT, [2]=PhanTram, [3]=actions
  test("deductionColumns - cell MaKT renders", () => {
    renderCell(deductionColumns[0], { MaKT: "KT01", LoaiKT: "Thuế", PhanTram: 10 });
    expect(screen.getByText("KT01")).toBeInTheDocument();
  });

  test("deductionColumns - cell LoaiKT renders", () => {
    renderCell(deductionColumns[1], { MaKT: "KT01", LoaiKT: "Thuế", PhanTram: 10 });
    expect(screen.getByText("Thuế")).toBeInTheDocument();
  });

  test("deductionColumns - cell PhanTram renders", () => {
    renderCell(deductionColumns[2], { MaKT: "KT01", LoaiKT: "Thuế", PhanTram: 10 });
    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  // ===== hoursColumns =====
  // [0]=MaGL, [1]=SoGioLam, ... [actions]
  test("hoursColumns - cell MaGL renders", () => {
    renderCell(hoursColumns[0], { MaGL: "GL01", SoGioLam: 8, SoNgayLam: 26, TongSoGio: 208 });
    expect(screen.getByText("GL01")).toBeInTheDocument();
  });

  // ===== payRollColumns =====
  // [0]=MaBL, [1]=MaNV, [2]=HoVaTen, [3]=MaKT, [4]=MaPC, [5]=TongGioCong, [6]=MaLCB, [7]=Thang, [8]=NgayTinhLuong, [9]=TongLuong, [10]=actions
  test("payRollColumns - cell MaBL renders", () => {
    renderCell(payRollColumns[0], { MaBL: "BL01", MaNV: "NV01", TongLuong: 15000000, TrangThai: "Đã thanh toán", MaKT: "KT01", MaPC: "PC01" });
    expect(screen.getByText("BL01")).toBeInTheDocument();
  });

  test("payRollColumns - cell MaNV renders", () => {
    renderCell(payRollColumns[1], { MaBL: "BL01", MaNV: "NV01", TongLuong: 15000000 });
    expect(screen.getByText("NV01")).toBeInTheDocument();
  });

  test("payRollColumns - cell TongLuong renders formatted currency", () => {
    renderCell(payRollColumns[9], { MaBL: "BL01", TongLuong: 15000000 });
    // toLocaleString("vi-VN") → "15.000.000" → "15.000.000 VND"
    expect(screen.getByText(/15\.000\.000 VND/)).toBeInTheDocument();
  });
});
