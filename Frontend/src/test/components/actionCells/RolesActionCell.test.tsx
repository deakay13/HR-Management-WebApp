import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { RolesActionCell } from "@/components/actionCells/managements/RolesActionCell";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useGrantPermissionsStore } from "@/stores/permissionStores/grantPermissionsStore";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/stores/permissionStores/rolesStore");
vi.mock("@/stores/permissionStores/grantPermissionsStore");
vi.mock("@/stores/permissionStores/permissionsStore");

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

describe("RolesActionCell", () => {
  const mockItem = { 
    MaVT: "VT01", TenVaiTro: "Giam Doc", 
    permissions: [{ MaQuyen: "Q01", TenQuyen: "Doc" }] 
  };
  const mockUpdateRoles = vi.fn();
  const mockDeleteRole = vi.fn();
  const mockDeleteAllGrantPermissions = vi.fn();
  const mockDeleteOneGrantPermissions = vi.fn();
  const mockUpdateGrantPermissions = vi.fn();
  const mockAssigGrantPermissions = vi.fn();
  const mockGetGrantPermissions = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useRolesStore as any).mockReturnValue({
      updateRoles: mockUpdateRoles,
      deleteRole: mockDeleteRole
    });
    (useGrantPermissionsStore as any).mockReturnValue({
      deleteAllGrantPermissions: mockDeleteAllGrantPermissions,
      deleteOneGrantPermissions: mockDeleteOneGrantPermissions,
      updateGrantPermissions: mockUpdateGrantPermissions,
      assigGrantPermissions: mockAssigGrantPermissions,
      getGrantPermissions: mockGetGrantPermissions
    });
    (usePermissionsStore as any).mockReturnValue({
      Permissions: [{ MaQuyen: "Q01", TenQuyen: "Doc" }, { MaQuyen: "Q02", TenQuyen: "Ghi" }]
    });
    (useAuthorizeStore as any).mockReturnValue({
      role: { MaVT: "VT001" } // Admin role
    });
  });

  const renderComponent = () => render(
    <RolesActionCell rol={mockItem as any} />
  );

  test("Returns null if not admin/hr", () => {
    (useAuthorizeStore as any).mockReturnValue({ role: { MaVT: "VT003" } });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders dropdown for HR role (isHR=true)", async () => {
    (useAuthorizeStore as any).mockReturnValue({ role: { MaVT: "VT002" } }); // HR
    renderComponent();
    // HR can see Cấp Quyền but not Sửa Vai Trò / Xoá sections
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("Renders action cell and can open update role dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa Vai Trò"));

    const nameInput = screen.getByRole("textbox");
    fireEvent.change(nameInput, { target: { value: "Super Admin" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(mockUpdateRoles).toHaveBeenCalledWith("VT01", expect.objectContaining({ TenVaiTro: "Super Admin" }));
    });
  });

  test("Renders action cell and can open cap quyen dialog and submit", async () => {
    const user = userEvent.setup();
    // Give item without any permission so Q02 is available to assign
    const mockItemNoPerms = { MaVT: "VT01", TenVaiTro: "Giam Doc", permissions: [] };
    render(<RolesActionCell rol={mockItemNoPerms as any} />);
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Cấp Quyền"));

    // checkboxes for Q01 and Q02
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const capQuyenBtn = screen.getAllByRole("button", { name: "Cấp Quyền" });
    // find submit button
    const submitBtn = capQuyenBtn[capQuyenBtn.length - 1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAssigGrantPermissions).toHaveBeenCalledWith({
        MaVT: "VT01",
        MaQuyen: expect.arrayContaining(["Q01"])
      });
    });
  });

  test("Renders action cell and can open delete selected permissions dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá Từng Quyền"));

    // Check the checkbox for the permission
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const delBtn = screen.getByRole("button", { name: "Xoá Các Quyền Đã Chọn" });
    fireEvent.click(delBtn);

    await waitFor(() => {
      expect(mockDeleteOneGrantPermissions).toHaveBeenCalledWith("VT01", "Q01");
    });
  });

  test("Shows empty state in Xoa Tung Quyen dialog when no permissions", async () => {
    const mockItemNoPerms = { MaVT: "VT01", TenVaiTro: "Giam Doc", permissions: [] };
    const user = userEvent.setup();
    render(<RolesActionCell rol={mockItemNoPerms as any} />);
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá Từng Quyền"));

    expect(screen.getByText("Vai trò chưa có quyền nào")).toBeInTheDocument();
  });

  test("Renders action cell and can open delete all permissions dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá Tất Cả Quyền"));

    const delBtn = screen.getByRole("button", { name: "Xoá" });
    fireEvent.click(delBtn);

    await waitFor(() => {
      expect(mockDeleteAllGrantPermissions).toHaveBeenCalledWith("VT01");
    });
  });

  test("Renders action cell and can open delete role dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá Vai Trò"));

    const delBtn = screen.getByRole("button", { name: "Xoá" });
    fireEvent.click(delBtn);

    await waitFor(() => {
      expect(mockDeleteRole).toHaveBeenCalledWith("VT01");
    });
  });

  test("Shows all permissions already assigned in Cap Quyen dialog", async () => {
    // When all permissions are already assigned, show empty message
    (usePermissionsStore as any).mockReturnValue({
      Permissions: [{ MaQuyen: "Q01", TenQuyen: "Doc" }]
    });
    const user = userEvent.setup();
    renderComponent(); // mockItem has Q01 permission
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Cấp Quyền"));

    expect(screen.getByText("Đã được cấp tất cả quyền")).toBeInTheDocument();
  });
});
