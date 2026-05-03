import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateBaseSalaryDialog } from "@/components/table/workspaceTable/dialogs/CreateBaseSalaryDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreateBaseSalaryMutation } from "@/hooks/queries/usePayrollQueries";

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
      <CreateBaseSalaryDialog open={true} onOpenChange={vi.fn()} {...props} />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateBaseSalaryDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateBaseSalaryMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo lương cơ bản")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Lương Cơ Bản")).toBeInTheDocument();
    expect(screen.getByLabelText("Lương Cơ Bản")).toBeInTheDocument();
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

  test("shows validation error for invalid MaLCB format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Lương Cơ Bản"), "INVALID");
    await user.clear(screen.getByLabelText("Lương Cơ Bản"));
    await user.type(screen.getByLabelText("Lương Cơ Bản"), "5000000");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Mã phải dạng LCBxxx/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("calls mutateAsync on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce({});
    renderComponent({ onOpenChange: onOpenChangeMock });
    await user.type(screen.getByLabelText("Mã Lương Cơ Bản"), "LCB001");
    await user.clear(screen.getByLabelText("Lương Cơ Bản"));
    await user.type(screen.getByLabelText("Lương Cơ Bản"), "5000000");
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("handles submission error gracefully", async () => {
    const user = userEvent.setup();
    mutateAsyncMock.mockRejectedValueOnce({ response: { data: { message: "Đã tồn tại" } } });
    renderComponent();
    await user.type(screen.getByLabelText("Mã Lương Cơ Bản"), "LCB002");
    await user.clear(screen.getByLabelText("Lương Cơ Bản"));
    await user.type(screen.getByLabelText("Lương Cơ Bản"), "6000000");
    submitForm();
    await waitFor(() => { expect(mutateAsyncMock).toHaveBeenCalledTimes(1); });
  });
});
