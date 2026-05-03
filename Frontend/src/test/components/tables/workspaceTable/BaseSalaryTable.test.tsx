import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { BaseSalaryTable } from "@/components/table/workspaceTable/BaseSalaryTable";
import { MemoryRouter } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { BaseSalaryServices } from "@/services/payRollServices/baseSalaryServices";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/services/payRollServices/baseSalaryServices", () => ({
  BaseSalaryServices: {
    exportBaseSalary: vi.fn(),
  }
}));
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Mock Dialog Component since we only test Table
vi.mock("@/components/table/workspaceTable/dialogs/CreateBaseSalaryDialog", () => ({
  CreateBaseSalaryDialog: ({ open, onOpenChange }: any) => {
    return open ? (
      <div data-testid="create-base-salary-dialog">
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null;
  }
}));

// Mock ActionCell to avoid rendering complex mutations and forms
vi.mock("@/components/actionCells/workspace/BaseSalaryActionCell", () => ({
  BaseSalaryActionCell: () => <div data-testid="base-salary-action-cell" />
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

describe("BaseSalaryTable", () => {
  const mockData = [
    { MaLCB: "LCB01", MaNV: "NV01", MucLuongCB: 5000000 },
    { MaLCB: "LCB02", MaNV: "NV02", MucLuongCB: 10000000 },
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
      <BaseSalaryTable data={mockData as any} {...props} />
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
    expect(screen.getByText("LCB01")).toBeInTheDocument();
    expect(screen.getByText("LCB02")).toBeInTheDocument();
  });

  test("can trigger export excel", async () => {
    const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    (BaseSalaryServices.exportBaseSalary as any).mockResolvedValue(mockBlob);

    const user = userEvent.setup();
    renderComponent();
    
    const exportBtn = screen.getByTitle("Xuất Excel");
    await user.click(exportBtn);

    expect(BaseSalaryServices.exportBaseSalary).toHaveBeenCalled();
  });

  test("can open create dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const createBtn = screen.getByRole("button", { name: "Tạo mới" });
    await user.click(createBtn);

    expect(screen.getByTestId("create-base-salary-dialog")).toBeInTheDocument();
  });
});
