import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateAccountDialog } from "@/components/table/managementsTable/dialogs/CreateAccountDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/accountStore", () => ({
  useAccountsStore: vi.fn(),
}));

vi.mock("@/stores/permissionStores/rolesStore", () => ({
  useRolesStore: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const mockRoles = [
  { MaVT: "VT001", TenVaiTro: "Admin" },
  { MaVT: "VT002", TenVaiTro: "Nhân viên" },
];

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateAccountDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateAccountDialog", () => {
  const createAccountMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAccountsStore as any).mockReturnValue({ createAccount: createAccountMock });
    (useRolesStore as any).mockReturnValue({ Roles: mockRoles });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo Tài Khoản")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Tài Khoản")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Nhân Viên")).toBeInTheDocument();
    expect(screen.getByLabelText("Tên Tài Khoản")).toBeInTheDocument();
    expect(screen.getByLabelText("Mật Khẩu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo mới" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(createAccountMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for invalid MaTK format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Tài Khoản"), "INVALID");
    submitForm();
    await waitFor(() => {
      // Regex /^TK\d{3,}$/ fails → error appears
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
      expect(createAccountMock).not.toHaveBeenCalled();
    });
  });

  test("shows validation error for short password", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Tài Khoản"), "TK001");
    await user.type(screen.getByLabelText("Mã Nhân Viên"), "NV001");
    await user.type(screen.getByLabelText("Tên Tài Khoản"), "nguyenvana");
    await user.type(screen.getByLabelText("Mật Khẩu"), "12");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/ít nhất 6 ký tự/i)).toBeInTheDocument();
      expect(createAccountMock).not.toHaveBeenCalled();
    });
  });

  test("blocks submission when MaVT (role Select) is not chosen", async () => {
    const user = userEvent.setup();
    renderComponent();
    // Fill all text fields but MaVT requires Radix Select which can't be set in jsdom
    await user.type(screen.getByLabelText("Mã Tài Khoản"), "TK001");
    await user.type(screen.getByLabelText("Mã Nhân Viên"), "NV001");
    await user.type(screen.getByLabelText("Tên Tài Khoản"), "nguyenvana");
    await user.type(screen.getByLabelText("Mật Khẩu"), "password123");
    submitForm();
    // MaVT empty → validation blocks
    await waitFor(() => {
      expect(createAccountMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("error class appears on invalid input field", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mật Khẩu"), "12"); // too short
    submitForm();
    await waitFor(() => {
      // border-red-500 class on password input
      const passwordInput = screen.getByLabelText("Mật Khẩu") as HTMLInputElement;
      expect(passwordInput.className).toContain("border-red-500");
    });
  });
});
