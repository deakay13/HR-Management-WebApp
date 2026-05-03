import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { PermissionsTable } from "@/components/table/managementsTable/PermissionsTable";
import { MemoryRouter } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/stores/permissionStores/permissionsStore");
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Mock Dialog Component since we only test Table
vi.mock("@/components/table/managementsTable/dialogs/CreatePermissionDialog", () => ({
  CreatePermissionDialog: ({ open, onOpenChange }: any) => {
    return open ? (
      <div data-testid="create-permission-dialog">
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null;
  }
}));

// Mock ActionCell to avoid rendering complex mutations and forms
vi.mock("@/components/actionCells/managements/PermissionsActionCell", () => ({
  PermissionActionCell: () => <div data-testid="permission-action-cell" />
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
}

describe("PermissionsTable", () => {
  const mockData = [
    { MaQuyen: "Q01", TenQuyen: "Đọc" },
    { MaQuyen: "Q02", TenQuyen: "Ghi" },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useAuthorizeStore as any).mockReturnValue({
      role: { MaVT: "VT001" },
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
    (usePermissionsStore as any).mockReturnValue({
      setSearchTerm: vi.fn(),
      setPagination: vi.fn()
    });
  });

  const renderComponent = (props: any = {}) => render(
    <MemoryRouter>
      <PermissionsTable data={mockData as any} {...props} />
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
    expect(screen.getByText("Q01")).toBeInTheDocument();
    expect(screen.getByText("Q02")).toBeInTheDocument();
  });

  test("can open create dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const createBtn = screen.getByRole("button", { name: "Tạo mới" });
    await user.click(createBtn);

    expect(screen.getByTestId("create-permission-dialog")).toBeInTheDocument();
  });
});
