import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { EmployeesActionCell } from "@/components/actionCells/informations/EmployeesActionCell";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";
import { TestQueryProvider } from "../../queries/queryTestUtils";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useUpdateEmployeeMutation, useDeleteEmployeeMutation } from "@/hooks/queries/useEmployeesQuery";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/hooks/queries/useEmployeesQuery");
vi.mock("@/hooks/queries/useDepartmentsQuery");

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

if (typeof window !== 'undefined' && !window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
    }
  } as any;
}
if (typeof window !== 'undefined') {
  window.ResizeObserver = class ResizeObserver { observe() {} unobserve() {} disconnect() {} };
}

describe("EmployeesActionCell", () => {
  const mockItem = { 
    MaNV: "NV01", HoVaTen: "Nguyen Van A", NgaySinh: "2000-01-01T00:00:00.000Z", NgayVaoLam: "2020-01-01T00:00:00.000Z",
    GioiTinh: "Nam", SDT: "0123456789", Email: "test@gmail.com",
    DiaChi: "HCM", MaPB: "P01", MaCV: "CV01"
  };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useUpdateEmployeeMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useDeleteEmployeeMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false });
    (useDepartmentsQuery as any).mockReturnValue({ 
      data: { data: [{ MaPB: "P01", TenPB: "IT" }, { MaPB: "P02", TenPB: "HR" }] } 
    });

    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = () => render(
    <TestQueryProvider><EmployeesActionCell emp={mockItem as any} /></TestQueryProvider>
  );

  test("Returns null if no write permissions", () => {
    (useAuthorizeStore as any).mockReturnValue({ permissions: [{ TenQuyen: "Đọc" }] });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders action cell and shows only delete option when canUpdate=false", async () => {
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Xoá" }] // no Sửa
    });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("Sửa")).not.toBeInTheDocument();
    expect(screen.getByText("Xoá")).toBeInTheDocument();
  });

  test("Renders action cell and can open update dialog with departments list", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    // dialog should open and have MaNV field disabled
    expect(screen.getByLabelText("Mã NV")).toHaveValue("NV01");
    expect(screen.getByLabelText("Mã NV")).toBeDisabled();
  });

  test("Renders action cell and can open update dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    // change all fields to hit onChange handlers
    const nameInput = screen.getByLabelText("Họ Và Tên");
    fireEvent.change(nameInput, { target: { value: "Nguyen Van B" } });

    const dobInput = screen.getByLabelText("Ngày Sinh");
    fireEvent.change(dobInput, { target: { value: "1995-01-01" } });

    const phoneInput = screen.getByLabelText("SĐT");
    fireEvent.change(phoneInput, { target: { value: "0987654321" } });

    const joinInput = screen.getByLabelText("Ngày Vào Làm");
    fireEvent.change(joinInput, { target: { value: "2021-01-01" } });

    const addressInput = screen.getByLabelText("Địa Chỉ");
    fireEvent.change(addressInput, { target: { value: "HN" } });

    // Wait for changes
    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
  });

  test("Shows validation error when form submitted with invalid data", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    // Clear name input to cause validation error
    const nameInput = screen.getByLabelText("Họ Và Tên");
    fireEvent.change(nameInput, { target: { value: "" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    // mutateAsync should NOT be called (validation failed)
    await waitFor(() => expect(mockMutateAsync).not.toHaveBeenCalled());
  });

  test("Renders action cell and can open delete dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá"));

    await user.click(screen.getByRole("button", { name: "Xoá" }));

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledWith("NV01"));
  });
});
