import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AccountsActionCell } from "@/components/actionCells/managements/AccountsActionCell";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/stores/authStores/accountStore");
vi.mock("@/stores/permissionStores/rolesStore");

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
    }
  }
  window.PointerEvent = PointerEvent as any;
}
if (typeof window !== 'undefined') {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe("AccountsActionCell", () => {
  const mockAccount = { MaTK: "TK01", TenTaiKhoan: "admin", MaVT: "VT01" };
  const mockUpdateAccount = vi.fn();
  const mockDeleteAccount = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    
    (useAccountsStore as any).mockReturnValue({
      updateAccount: mockUpdateAccount,
      deleteAccount: mockDeleteAccount
    });
    
    (useRolesStore as any).mockReturnValue({
      Roles: [{ MaVT: "VT01", TenVaiTro: "Admin" }],
      getRoles: vi.fn()
    });
    
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [
        { TenQuyen: "Tạo" },
        { TenQuyen: "Đọc" },
        { TenQuyen: "Sửa" },
        { TenQuyen: "Xoá" },
      ]
    });
  });

  const renderComponent = () => render(<AccountsActionCell acc={mockAccount as any} />);

  test("Returns null if no write permissions", () => {
    (useAuthorizeStore as any).mockReturnValue({ permissions: [{ TenQuyen: "Đọc" }] });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders action cell and can open update dialog", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const editMenu = await screen.findByText("Sửa");
    await user.click(editMenu);

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    expect(saveBtn).toBeInTheDocument();
  });

  test("Submits update without changes does not call updateAccount", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateAccount).not.toHaveBeenCalled();
    });
  });

  test("Submits update with changes calls updateAccount", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    const nameInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(nameInput, { target: { value: "newadmin" } });
    
    const passInput = screen.getByPlaceholderText("Để trống nếu không đổi");
    fireEvent.change(passInput, { target: { value: "newpassword" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateAccount).toHaveBeenCalledWith("TK01", expect.objectContaining({
        TenTaiKhoan: "newadmin",
        MatKhau: "newpassword"
      }));
    });
  });

  test("Renders action cell and can open delete dialog", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const deleteMenu = await screen.findByText("Xoá");
    await user.click(deleteMenu);

    const deleteBtn = screen.getByRole("button", { name: "Xoá" });
    await user.click(deleteBtn);
    
    expect(mockDeleteAccount).toHaveBeenCalledWith("TK01");
  });
});
