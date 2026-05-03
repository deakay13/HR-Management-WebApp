import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateDeductionDialog } from "@/components/table/workspaceTable/dialogs/CreateDeductionDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreateDeductionMutation } from "@/hooks/queries/usePayrollQueries";

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
      <CreateDeductionDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateDeductionDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateDeductionMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo khấu trừ")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Khấu Trừ")).toBeInTheDocument();
    expect(screen.getByLabelText("Loại Khấu Trừ")).toBeInTheDocument();
    expect(screen.getByLabelText("Phần Trăm (%)")).toBeInTheDocument();
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

  test("shows validation error for invalid MaKT format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Khấu Trừ"), "INVALID");
    await user.type(screen.getByLabelText("Loại Khấu Trừ"), "Thuế TNCN");
    await user.clear(screen.getByLabelText("Phần Trăm (%)"));
    await user.type(screen.getByLabelText("Phần Trăm (%)"), "10");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Mã phải bắt đầu bằng KT/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("shows validation error for PhanTram > 100", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Khấu Trừ"), "KT001");
    await user.type(screen.getByLabelText("Loại Khấu Trừ"), "Thuế");
    await user.clear(screen.getByLabelText("Phần Trăm (%)"));
    await user.type(screen.getByLabelText("Phần Trăm (%)"), "150");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Phần trăm không được vượt quá 100/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("calls mutateAsync on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce({});
    renderComponent({ onOpenChange: onOpenChangeMock });
    await user.type(screen.getByLabelText("Mã Khấu Trừ"), "KT001");
    await user.type(screen.getByLabelText("Loại Khấu Trừ"), "Thuế TNCN");
    await user.clear(screen.getByLabelText("Phần Trăm (%)"));
    await user.type(screen.getByLabelText("Phần Trăm (%)"), "10");
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("handles submission error gracefully", async () => {
    const user = userEvent.setup();
    mutateAsyncMock.mockRejectedValueOnce({ response: { data: { message: "Lỗi" } } });
    renderComponent();
    await user.type(screen.getByLabelText("Mã Khấu Trừ"), "KT002");
    await user.type(screen.getByLabelText("Loại Khấu Trừ"), "Bảo hiểm");
    await user.clear(screen.getByLabelText("Phần Trăm (%)"));
    await user.type(screen.getByLabelText("Phần Trăm (%)"), "5");
    submitForm();
    await waitFor(() => { expect(mutateAsyncMock).toHaveBeenCalledTimes(1); });
  });
});
