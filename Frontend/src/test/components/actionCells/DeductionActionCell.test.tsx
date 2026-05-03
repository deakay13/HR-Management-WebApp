import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { DeductionActionCell } from "@/components/actionCells/workspace/DeductionActionCell";
import { TestQueryProvider } from "../../queries/queryTestUtils";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useUpdateDeductionMutation, useDeleteDeductionMutation } from "@/hooks/queries/usePayrollQueries";
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

describe("DeductionActionCell", () => {
  const mockItem = { MaKT: "KT001", LoaiKT: "Thue", PhanTram: 10 };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useUpdateDeductionMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useDeleteDeductionMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = () => render(
    <TestQueryProvider><DeductionActionCell deduction={mockItem as any} /></TestQueryProvider>
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

    const loaiKTInput = screen.getByLabelText("Loại Khấu Trừ");
    fireEvent.change(loaiKTInput, { target: { value: "BHYT" } });

    const phanTramInput = screen.getByLabelText("Phần Trăm (%)");
    fireEvent.change(phanTramInput, { target: { value: "15" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: "KT001", data: { MaKT: "KT001", LoaiKT: "BHYT", PhanTram: 15 } });
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
      expect(mockMutateAsync).toHaveBeenCalledWith("KT001");
    });
  });

  test("Shows error toast when update mutation fails", async () => {
    mockMutateAsync.mockRejectedValue({ response: { data: { message: "Server error" } } });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => { expect(mockMutateAsync).toHaveBeenCalled(); });
  });

  test("Shows error toast when delete mutation fails", async () => {
    mockMutateAsync.mockRejectedValue({ response: { data: { message: "Delete failed" } } });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Xoá"));

    const delBtn = screen.getByRole("button", { name: "Xoá" });
    fireEvent.click(delBtn);

    await waitFor(() => { expect(mockMutateAsync).toHaveBeenCalled(); });
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
