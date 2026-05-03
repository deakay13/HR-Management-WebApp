import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { PermissionActionCell } from "@/components/actionCells/managements/PermissionsActionCell";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import i18n from "@/i18n";

vi.mock("@/stores/permissionStores/permissionsStore");
vi.mock("@/stores/authStores/useAuthorizeStore");
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

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

describe("PermissionActionCell", () => {
  const mockItem = { MaQuyen: "MQ001", TenQuyen: "Đọc" };
  const mockUpdatePermission = vi.fn();
  const mockDeletePermission = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (usePermissionsStore as any).mockReturnValue({
      updatePermissions: mockUpdatePermission,
      deletePermission: mockDeletePermission
    });
    (useAuthorizeStore as any).mockReturnValue({
      role: { MaVT: "VT001" }, // Admin
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = () => render(
    <PermissionActionCell permis={mockItem as any} />
  );

  test("Returns null if no write permissions", () => {
    (useAuthorizeStore as any).mockReturnValue({ permissions: [{ TenQuyen: "Đọc" }] });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders action cell and can open update dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    const input = screen.getByLabelText("Tên Quyền");
    fireEvent.change(input, { target: { value: "Quyen Moi" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdatePermission).toHaveBeenCalledWith("MQ001", expect.objectContaining({ TenQuyen: "Quyen Moi" }));
    });
  });

  test("Renders action cell and can open delete dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá"));

    const delBtn = screen.getByRole("button", { name: "Xoá" });
    fireEvent.click(delBtn);

    await waitFor(() => {
      expect(mockDeletePermission).toHaveBeenCalledWith("MQ001");
    });
  });
});
