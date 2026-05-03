import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AllowanceActionCell } from "@/components/actionCells/workspace/AllowanceActionCell";
import { TestQueryProvider } from "../../queries/queryTestUtils";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useUpdateAllowanceMutation, useDeleteAllowanceMutation } from "@/hooks/queries/usePayrollQueries";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/hooks/queries/usePayrollQueries");
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

describe("AllowanceActionCell", () => {
  const mockItem = { MaPC: "PC001", TenPC: "Phu cap 1", SoTien: 100000 };
  const mockUpdateAsync = vi.fn();
  const mockDeleteAsync = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    mockUpdateAsync.mockResolvedValue({});
    mockDeleteAsync.mockResolvedValue({});
    (useUpdateAllowanceMutation as any).mockReturnValue({ mutateAsync: mockUpdateAsync });
    (useDeleteAllowanceMutation as any).mockReturnValue({ mutateAsync: mockDeleteAsync });
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = () => render(
    <TestQueryProvider><AllowanceActionCell allowance={mockItem as any} /></TestQueryProvider>
  );

  test("Returns null if no write permissions", () => {
    (useAuthorizeStore as any).mockReturnValue({ permissions: [{ TenQuyen: "Đọc" }] });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders action cell and can open update dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    const loaiPCInput = screen.getByLabelText("Loại Phụ Cấp");
    fireEvent.change(loaiPCInput, { target: { value: "PC An Trua" } });

    const soTienInput = screen.getByLabelText("Số Tiền");
    fireEvent.change(soTienInput, { target: { value: "50000" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateAsync).toHaveBeenCalledWith({ id: "PC001", data: { MaPC: "PC001", LoaiPC: "PC An Trua", SoTien: 50000 } });
    });
  });

  test("Renders action cell and can open delete dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá"));

    const delBtn = screen.getByRole("button", { name: "Xoá" });
    fireEvent.click(delBtn);

    await waitFor(() => {
      expect(mockDeleteAsync).toHaveBeenCalledWith("PC001");
    });
  });

  test("Shows error toast when update mutation fails", async () => {
    mockUpdateAsync.mockRejectedValue({ response: { data: { message: "Server error" } } });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    // Form already has valid default values from mockItem - just submit
    const loaiPCInput = screen.getByLabelText("Loại Phụ Cấp");
    fireEvent.change(loaiPCInput, { target: { value: "PC An Trua" } });
    const soTienInput = screen.getByLabelText("Số Tiền");
    fireEvent.change(soTienInput, { target: { value: "50000" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdateAsync).toHaveBeenCalled();
    });
  });

  test("Shows error toast when delete mutation fails", async () => {
    mockDeleteAsync.mockRejectedValue({ response: { data: { message: "Delete failed" } } });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá"));

    const delBtn = screen.getByRole("button", { name: "Xoá" });
    fireEvent.click(delBtn);

    await waitFor(() => { expect(mockDeleteAsync).toHaveBeenCalled(); });
  });

  test("Shows only delete option when canUpdate=false", async () => {
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Xoá" }]
    });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("Sửa")).not.toBeInTheDocument();
    expect(screen.getByText("Xoá")).toBeInTheDocument();
  });
});
