import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreatePayRollDialog } from "@/components/table/workspaceTable/dialogs/CreatePayRollDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreatePayrollMutation } from "@/hooks/queries/usePayrollQueries";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/hooks/queries/usePayrollQueries", () => ({
  useCreateAllowanceMutation: vi.fn(),
  useCreateBaseSalaryMutation: vi.fn(),
  useCreateDeductionMutation: vi.fn(),
  useCreateHourMutation: vi.fn(),
  useCreatePayrollMutation: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreatePayRollDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreatePayRollDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreatePayrollMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo bảng lương")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Bảng Lương")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Nhân Viên")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Khấu Trừ")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Phụ Cấp")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Lương Cơ Bản")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Giờ Làm")).toBeInTheDocument();
    expect(screen.getByLabelText("Tháng")).toBeInTheDocument();
    expect(screen.getByLabelText("Số ngày công")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo mới" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for invalid MaBL format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Bảng Lương"), "INVALID");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Mã phải bắt đầu bằng BL/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("calls mutateAsync on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce({});
    renderComponent({ onOpenChange: onOpenChangeMock });
    await user.type(screen.getByLabelText("Mã Bảng Lương"), "BL001");
    await user.type(screen.getByLabelText("Mã Nhân Viên"), "NV001");
    await user.type(screen.getByLabelText("Mã Khấu Trừ"), "KT001");
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "PC001");
    await user.type(screen.getByLabelText("Mã Lương Cơ Bản"), "LCB001");
    await user.type(screen.getByLabelText("Mã Giờ Làm"), "GL001");
    await user.type(screen.getByLabelText("Tháng"), "2024-01");
    await user.clear(screen.getByLabelText("Số ngày công"));
    await user.type(screen.getByLabelText("Số ngày công"), "26");
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("handles submission error gracefully", async () => {
    const user = userEvent.setup();
    mutateAsyncMock.mockRejectedValueOnce({ response: { data: { message: "Lỗi server" } } });
    renderComponent();
    await user.type(screen.getByLabelText("Mã Bảng Lương"), "BL002");
    await user.type(screen.getByLabelText("Mã Nhân Viên"), "NV002");
    await user.type(screen.getByLabelText("Mã Khấu Trừ"), "KT001");
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "PC001");
    await user.type(screen.getByLabelText("Mã Lương Cơ Bản"), "LCB001");
    await user.type(screen.getByLabelText("Mã Giờ Làm"), "GL001");
    await user.type(screen.getByLabelText("Tháng"), "2024-02");
    await user.clear(screen.getByLabelText("Số ngày công"));
    await user.type(screen.getByLabelText("Số ngày công"), "26");
    submitForm();
    await waitFor(() => { expect(mutateAsyncMock).toHaveBeenCalledTimes(1); });
  });
});
