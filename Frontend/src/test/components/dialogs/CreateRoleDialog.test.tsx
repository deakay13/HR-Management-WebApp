import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateRoleDialog } from "@/components/table/managementsTable/dialogs/CreateRoleDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/permissionStores/rolesStore", () => ({
  useRolesStore: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateRoleDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateRoleDialog", () => {
  const createRolesMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRolesStore as any).mockReturnValue({ createRoles: createRolesMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo vai trò")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Vai Trò")).toBeInTheDocument();
    expect(screen.getByLabelText("Tên Vai Trò")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thêm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(createRolesMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for invalid MaVT format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Vai Trò"), "INVALID");
    await user.type(screen.getByLabelText("Tên Vai Trò"), "Quản trị viên");
    submitForm();
    await waitFor(() => {
      // Regex /^VT\d{3,}$/ fails
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
      expect(createRolesMock).not.toHaveBeenCalled();
    });
  });

  test("shows validation error for short TenVaiTro", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Vai Trò"), "VT001");
    await user.type(screen.getByLabelText("Tên Vai Trò"), "AB");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/ít nhất 3 ký tự/i)).toBeInTheDocument();
      expect(createRolesMock).not.toHaveBeenCalled();
    });
  });

  test("calls createRoles on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    createRolesMock.mockResolvedValueOnce(undefined);
    renderComponent({ onOpenChange: onOpenChangeMock });

    await user.type(screen.getByLabelText("Mã Vai Trò"), "VT001");
    await user.type(screen.getByLabelText("Tên Vai Trò"), "Quản trị viên");

    submitForm();
    await waitFor(() => {
      expect(createRolesMock).toHaveBeenCalledTimes(1);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("handles submission error gracefully", async () => {
    const user = userEvent.setup();
    createRolesMock.mockRejectedValueOnce(new Error("Error"));
    renderComponent();

    await user.type(screen.getByLabelText("Mã Vai Trò"), "VT002");
    await user.type(screen.getByLabelText("Tên Vai Trò"), "Nhân viên");

    submitForm();
    await waitFor(() => { expect(createRolesMock).toHaveBeenCalledTimes(1); });
  });
});
