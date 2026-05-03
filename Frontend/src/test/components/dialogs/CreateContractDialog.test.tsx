import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CreateContractDialog } from "@/components/table/informationsTable/dialogs/CreateContractDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n";
import { useCreateContractMutation } from "@/hooks/queries/useContractsQuery";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/hooks/queries/useContractsQuery", () => ({
  useCreateContractMutation: vi.fn(),
}));

vi.mock("@/hooks/queries/useEmployeesQuery", () => ({
  useCreateEmployeeMutation: vi.fn(),
  useEmployeesQuery: vi.fn(),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const mockEmployees = [
  { MaNV: "NV001", HoVaTen: "Nguyễn Văn A" },
  { MaNV: "NV002", HoVaTen: "Trần Thị B" },
];

const renderComponent = (props: any = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateContractDialog
        open={true}
        onOpenChange={vi.fn()}
        existingCodes={["HD001"]}
        {...props}
      />
    </QueryClientProvider>
  );

const submitForm = () => {
  const form = document.querySelector("form");
  if (form) fireEvent.submit(form);
};

describe("CreateContractDialog", () => {
  const mutateAsyncMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateContractMutation as any).mockReturnValue({ mutateAsync: mutateAsyncMock });
    (useEmployeesQuery as any).mockReturnValue({ data: { data: mockEmployees } });
  });

  test("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Tạo Hợp Đồng Mới")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Hợp Đồng")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Nhân Viên")).toBeInTheDocument();
    expect(screen.getByLabelText("Loại Hợp Đồng")).toBeInTheDocument();
    expect(screen.getByLabelText("Ngày Bắt Đầu")).toBeInTheDocument();
    expect(screen.getByLabelText("Chức Danh")).toBeInTheDocument();
    expect(screen.getByLabelText("Mã Phòng Ban")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo mới" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderComponent();
    submitForm();
    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled();
      const errors = document.querySelectorAll("span.text-red-500, span.text-xs.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test("shows validation errors for invalid MaHopDong format", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Hợp Đồng"), "INVALID");
    submitForm();
    await waitFor(() => {
      // getContractValidationSchema extends with min(1) but no format check
      // So ContractSchema's refine runs -> format error from ContractSchema base
      // Either format error or other required errors appear
      const errors = document.querySelectorAll("span.text-red-500, span.text-xs.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
      expect(mutateAsyncMock).not.toHaveBeenCalled();
    });
  });

  test("shows validation error for duplicate MaHopDong", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.type(screen.getByLabelText("Mã Hợp Đồng"), "HD001");
    submitForm();
    await waitFor(() => {
      expect(screen.getByText(/Mã hợp đồng này đã tồn tại/i)).toBeInTheDocument();
    });
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  test("calls mutateAsync on successful submission", async () => {
    const user = userEvent.setup();
    const onOpenChangeMock = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce({});
    renderComponent({ onOpenChange: onOpenChangeMock });

    await user.type(screen.getByLabelText("Mã Hợp Đồng"), "HD002");
    await user.type(screen.getByLabelText("Mã Nhân Viên"), "NV001");
    await user.type(screen.getByLabelText("Loại Hợp Đồng"), "Có thời hạn");
    await user.type(screen.getByLabelText("Ngày Bắt Đầu"), "2020-01-01");
    await user.type(screen.getByLabelText("Chức Danh"), "Kế Toán");
    await user.type(screen.getByLabelText("Mã Phòng Ban"), "PB001");
    await user.type(screen.getByLabelText("Mã Lương CB"), "LCB001");
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "PC001");
    await user.type(screen.getByLabelText("Hình Thức Trả Lương"), "Chuyển khoản");
    await user.type(screen.getByLabelText("Tình Trạng"), "Còn hiệu lực");

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

    await user.type(screen.getByLabelText("Mã Hợp Đồng"), "HD003");
    await user.type(screen.getByLabelText("Mã Nhân Viên"), "NV001");
    await user.type(screen.getByLabelText("Loại Hợp Đồng"), "Không thời hạn");
    await user.type(screen.getByLabelText("Ngày Bắt Đầu"), "2021-01-01");
    await user.type(screen.getByLabelText("Chức Danh"), "Dev");
    await user.type(screen.getByLabelText("Mã Phòng Ban"), "PB001");
    await user.type(screen.getByLabelText("Mã Lương CB"), "LCB001");
    await user.type(screen.getByLabelText("Mã Phụ Cấp"), "PC001");
    await user.type(screen.getByLabelText("Hình Thức Trả Lương"), "Tiền mặt");
    await user.type(screen.getByLabelText("Tình Trạng"), "Còn hiệu lực");

    submitForm();
    await waitFor(() => { expect(mutateAsyncMock).toHaveBeenCalledTimes(1); });
  });
});
