import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { EmployeeTable } from "@/components/table/informationsTable/EmployeeTable";
import { MemoryRouter } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { EmployeeServices } from "@/services/informationServices/employeeServices";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/services/informationServices/employeeServices", () => ({
  EmployeeServices: {
    exportEmployees: vi.fn(),
  }
}));
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Mock Dialog Component since we only test Table
vi.mock("@/components/table/informationsTable/dialogs/CreateEmployeeDialog", () => ({
  CreateEmployeeDialog: ({ open, onOpenChange }: any) => {
    return open ? (
      <div data-testid="create-employee-dialog">
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null;
  }
}));

// Mock ActionCell to avoid rendering complex mutations and forms
vi.mock("@/components/actionCells/informations/EmployeesActionCell", () => ({
  EmployeesActionCell: () => <div data-testid="employee-action-cell" />
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

describe("EmployeeTable", () => {
  const mockData = [
    { MaNV: "NV01", HoVaTen: "Nguyen Van A" },
    { MaNV: "NV02", HoVaTen: "Tran Thi B" },
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
      <EmployeeTable data={mockData as any} {...props} />
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
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("Tran Thi B")).toBeInTheDocument();
  });

  test("can trigger export excel", async () => {
    const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    (EmployeeServices.exportEmployees as any).mockResolvedValue(mockBlob);

    const user = userEvent.setup();
    renderComponent();
    
    const exportBtn = screen.getByTitle("Xuất Excel");
    await user.click(exportBtn);

    expect(EmployeeServices.exportEmployees).toHaveBeenCalled();
  });

  test("can open create dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const createBtn = screen.getByRole("button", { name: "Tạo mới" });
    await user.click(createBtn);

    expect(screen.getByTestId("create-employee-dialog")).toBeInTheDocument();
  });
});
