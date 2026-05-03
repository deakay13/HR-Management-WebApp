import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { DeductionTable } from "@/components/table/workspaceTable/DeductionTable";
import { MemoryRouter } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/services/payRollServices/deductionServices", () => ({
  DeductionServices: {
    exportDeduction: vi.fn(),
  }
}));
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Mock Dialog Component since we only test Table
vi.mock("@/components/table/workspaceTable/dialogs/CreateDeductionDialog", () => ({
  CreateDeductionDialog: ({ open, onOpenChange }: any) => {
    return open ? (
      <div data-testid="create-deduction-dialog">
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null;
  }
}));

// Mock ActionCell to avoid rendering complex mutations and forms
vi.mock("@/components/actionCells/workspace/DeductionActionCell", () => ({
  DeductionActionCell: () => <div data-testid="deduction-action-cell" />
}));

if (typeof window !== 'undefined' && !window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
    }
  } as any;
}
if (typeof window !== 'undefined') {
  window.ResizeObserver = class ResizeObserver { observe() {} unobserve() {} disconnect() {} };
  window.URL.createObjectURL = vi.fn();
}

describe("DeductionTable", () => {
  const mockData = [
    { MaKT: "KT01", MaNV: "NV01", LoaiKT: "Thuế", SoTien: 500000 },
    { MaKT: "KT02", MaNV: "NV02", LoaiKT: "Bảo hiểm", SoTien: 1000000 },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = (props: any = {}) => render(
    <MemoryRouter>
      <DeductionTable data={mockData as any} {...props} />
    </MemoryRouter>
  );

  test("renders loading state", () => {
    renderComponent({ loading: true });
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  test("renders empty state", () => {
    renderComponent({ data: [] });
    expect(screen.getByText("Không có dữ liệu.")).toBeInTheDocument();
  });

  test("renders data rows", () => {
    renderComponent();
    expect(screen.getByText("KT01")).toBeInTheDocument();
    expect(screen.getByText("KT02")).toBeInTheDocument();
  });

  test("can trigger export excel", async () => {
    const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    (DeductionServices.exportDeduction as any).mockResolvedValue(mockBlob);

    const user = userEvent.setup();
    renderComponent();
    
    const exportBtn = screen.getByTitle("Xuất Excel");
    await user.click(exportBtn);

    expect(DeductionServices.exportDeduction).toHaveBeenCalled();
  });

  test("can open create dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const createBtn = screen.getByRole("button", { name: "Tạo mới" });
    await user.click(createBtn);

    expect(screen.getByTestId("create-deduction-dialog")).toBeInTheDocument();
  });
});
