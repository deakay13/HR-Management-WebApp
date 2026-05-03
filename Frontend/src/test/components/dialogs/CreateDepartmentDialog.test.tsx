import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateDepartmentDialog } from "@/components/table/informationsTable/dialogs/CreateDepartmentDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreateDepartmentMutation } from "@/hooks/queries/useDepartmentsQuery";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/hooks/queries/useDepartmentsQuery", () => ({
  useCreateDepartmentMutation: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateDepartmentDialog
        open={true}
        onOpenChange={vi.fn()}
        existingDepartmentIds={["PB001"]}
        {...props}
      />
    </QueryClientProvider>
  );

const submitForm = () => {
  // Radix Dialog renders into a portal, so form is in document.body not container
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateDepartmentDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateDepartmentMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo Phòng Ban Mới")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Phòng Ban")).toBeInTheDocument();
    expect(screen.getByLabelText("Tên Phòng Ban")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo mới" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      // Any Zod error means form is blocked — verify mutation was not called
      expect(mutateAsyncMock).not.toHaveBeenCalled();
      // At least one visible error element should exist
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for short TenPB", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Phòng Ban"), "PB999");
    await user.type(screen.getByLabelText("Tên Phòng Ban"), "A");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Tên phòng ban phải từ 2 ký tự/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("shows validation error for duplicate department ID", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Phòng Ban"), "PB001");
    await user.type(screen.getByLabelText("Tên Phòng Ban"), "Phòng Nhân Sự");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Mã phòng ban này đã tồn tại/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("calls mutateAsync and closes dialog on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce({});
    renderComponent({ onOpenChange: onOpenChangeMock });
    await user.type(screen.getByLabelText("Mã Phòng Ban"), "PB002");
    await user.type(screen.getByLabelText("Tên Phòng Ban"), "Kế Toán");
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
    await user.type(screen.getByLabelText("Mã Phòng Ban"), "PB003");
    await user.type(screen.getByLabelText("Tên Phòng Ban"), "Phòng IT");
    submitForm();
    await waitFor(() => { expect(mutateAsyncMock).toHaveBeenCalledTimes(1); });
  });
});
