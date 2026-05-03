import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreatePermissionDialog } from "@/components/table/managementsTable/dialogs/CreatePermissionDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/permissionStores/permissionsStore", () => ({
  usePermissionsStore: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreatePermissionDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreatePermissionDialog", () => {
  const createPermissionsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePermissionsStore as any).mockReturnValue({ createPermissions: createPermissionsMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo quyền")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Quyền")).toBeInTheDocument();
    expect(screen.getByLabelText("Tên Quyền")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thêm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(createPermissionsMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for invalid MaQuyen format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Quyền"), "INVALID");
    await user.type(screen.getByLabelText("Tên Quyền"), "Đọc dữ liệu");
    submitForm();
    await waitFor(() => {
      // Regex /^MQ\d{3}$/ fails
      expect(screen.getByText(/MQxxx/i)).toBeInTheDocument();
      expect(createPermissionsMock).not.toHaveBeenCalled();
    });
  });

  test("shows validation error for short TenQuyen", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Quyền"), "MQ001");
    await user.type(screen.getByLabelText("Tên Quyền"), "Đọ");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/ít nhất 3 ký tự/i)).toBeInTheDocument();
      expect(createPermissionsMock).not.toHaveBeenCalled();
    });
  });

  test("calls createPermissions on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    createPermissionsMock.mockResolvedValueOnce(undefined);
    renderComponent({ onOpenChange: onOpenChangeMock });

    await user.type(screen.getByLabelText("Mã Quyền"), "MQ001");
    await user.type(screen.getByLabelText("Tên Quyền"), "Đọc dữ liệu");

    submitForm();
    await waitFor(() => {
      expect(createPermissionsMock).toHaveBeenCalledTimes(1);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("handles submission error gracefully", async () => {
    const user = userEvent.setup();
    createPermissionsMock.mockRejectedValueOnce(new Error("Error"));
    renderComponent();

    await user.type(screen.getByLabelText("Mã Quyền"), "MQ002");
    await user.type(screen.getByLabelText("Tên Quyền"), "Ghi dữ liệu");

    submitForm();
    await waitFor(() => { expect(createPermissionsMock).toHaveBeenCalledTimes(1); });
  });
});
