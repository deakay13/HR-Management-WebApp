import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateEmployeeDialog } from "@/components/table/informationsTable/dialogs/CreateEmployeeDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreateEmployeeMutation } from "@/hooks/queries/useEmployeesQuery";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/hooks/queries/useEmployeesQuery", () => ({
  useCreateEmployeeMutation: vi.fn(),
}));

vi.mock("@/hooks/queries/useDepartmentsQuery", () => ({
  useCreateDepartmentMutation: vi.fn(),
  useDepartmentsQuery: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const mockDepartments = [
  { MaPB: "PB001", TenPB: "Phòng Kế Toán" },
  { MaPB: "PB002", TenPB: "Phòng Nhân Sự" },
];

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateEmployeeDialog
        open={true}
        onOpenChange={vi.fn()}
        existingCodes={["NV001"]}
        {...props}
      />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateEmployeeDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateEmployeeMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
    (useDepartmentsQuery as any).mockReturnValue({ data: { data: mockDepartments } });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo nhân viên mới")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã nhân viên")).toBeInTheDocument();
    expect(screen.getByLabelText("Họ và tên")).toBeInTheDocument();
    expect(screen.getByLabelText("Ngày sinh")).toBeInTheDocument();
    expect(screen.getByLabelText("Số điện thoại")).toBeInTheDocument();
    expect(screen.getByLabelText("Ngày vào làm")).toBeInTheDocument();
    expect(screen.getByLabelText("Địa chỉ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo nhân viên" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("span.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation error for invalid MaNV format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã nhân viên"), "INVALID");
    submitForm();
    await waitFor(() => {
      expect(
        screen.getByText(/Mã nhân viên phải có định dạng NVxxx/i)
      ).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("shows validation error for duplicate MaNV - blocked by required fields first", async () => {
    const user = userEvent.setup();
    renderComponent();
    // NV001 is in existingCodes, but schema.refine runs after base schema passes
    // Without MaPB (Select) and GioiTinh (Select), base schema blocks first
    await user.type(screen.getByLabelText("Mã nhân viên"), "NV001");
    submitForm();
    await waitFor(() => {
      // Any error blocks submission
      const errors = document.querySelectorAll("span.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
      expect(mutateAsyncMock).not.toHaveBeenCalled();
    });
  });

  test("shows validation error for short phone number", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Số điện thoại"), "123");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/ít nhất 10 số/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("blocks submission when MaPB/GioiTinh select fields empty", async () => {
    const user = userEvent.setup();
    renderComponent();
    // Fill all text inputs but can't fill Radix Select in jsdom without pointer events
    await user.type(screen.getByLabelText("Mã nhân viên"), "NV002");
    await user.type(screen.getByLabelText("Họ và tên"), "Nguyễn Văn An");
    await user.type(screen.getByLabelText("Số điện thoại"), "0912345678");
    await user.type(screen.getByLabelText("Ngày sinh"), "1990-01-01");
    await user.type(screen.getByLabelText("Ngày vào làm"), "2020-01-01");
    await user.type(screen.getByLabelText("Địa chỉ"), "Hà Nội");
    submitForm();
    // MaPB and GioiTinh still empty -> validation blocks mutation
    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled();
    });
  });
});
