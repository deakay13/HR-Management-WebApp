import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateAllowanceDialog } from "@/components/table/workspaceTable/dialogs/CreateAllowanceDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreateAllowanceMutation } from "@/hooks/queries/usePayrollQueries";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/hooks/queries/usePayrollQueries", () => ({
  useCreateAllowanceMutation: vi.fn(),
  useCreateBaseSalaryMutation: vi.fn(),
  useCreateDeductionMutation: vi.fn(),
  useCreateHourMutation: vi.fn(),
  useCreatePayrollMutation: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateAllowanceDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateAllowanceDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateAllowanceMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo phụ cấp")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Phụ Cấp")).toBeInTheDocument();
    expect(screen.getByLabelText("Loại Phụ Cấp")).toBeInTheDocument();
    expect(screen.getByLabelText("Số Tiền")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo mới" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation error for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for invalid MaPC format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "INVALID");
    await user.type(screen.getByLabelText("Loại Phụ Cấp"), "Xăng xe");
    await user.clear(screen.getByLabelText("Số Tiền"));
    await user.type(screen.getByLabelText("Số Tiền"), "500000");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Mã phải dạng PCxxx/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("calls mutateAsync and closes on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce({});
    renderComponent({ onOpenChange: onOpenChangeMock });
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "PC001");
    await user.type(screen.getByLabelText("Loại Phụ Cấp"), "Xăng xe");
    await user.clear(screen.getByLabelText("Số Tiền"));
    await user.type(screen.getByLabelText("Số Tiền"), "500000");
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("handles submission error gracefully", async () => {
    const user = userEvent.setup();
    mutateAsyncMock.mockRejectedValueOnce(new Error("Server error"));
    renderComponent();
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "PC002");
    await user.type(screen.getByLabelText("Loại Phụ Cấp"), "Ăn trưa");
    await user.clear(screen.getByLabelText("Số Tiền"));
    await user.type(screen.getByLabelText("Số Tiền"), "200000");
    submitForm();
    await waitFor(() => { expect(mutateAsyncMock).toHaveBeenCalledTimes(1); });
  });
});
