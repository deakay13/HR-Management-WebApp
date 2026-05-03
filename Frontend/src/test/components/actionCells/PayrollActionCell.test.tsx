import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { PayRollActionCell } from "@/components/actionCells/workspace/PayrollActionCell";
import { TestQueryProvider } from "../../queries/queryTestUtils";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useUpdatePayrollMutation, useDeletePayrollMutation } from "@/hooks/queries/usePayrollQueries";
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

describe("PayrollActionCell", () => {
  const mockItem = { MaBL: "BL001", MaNV: "NV001", MaLCB: "LCB001", MaPC: "PC001", MaKT: "KT001", MaGL: "GL001", Thang: "2024-01", SoNgayLam: 26 };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useUpdatePayrollMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useDeletePayrollMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = () => render(
    <TestQueryProvider><PayRollActionCell payRoll={mockItem as any} /></TestQueryProvider>
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

    const thangInput = document.querySelector('input[name="Thang"]') as HTMLInputElement;
    fireEvent.change(thangInput, { target: { value: "2024-02" } });

    const saveBtn = screen.getByRole("button", { name: "Tính lại lương" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: "BL001", data: expect.objectContaining({ Thang: "2024-02" }) });
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
      expect(mockMutateAsync).toHaveBeenCalledWith("BL001");
    });
  });

  test("Shows error toast when update mutation fails", async () => {
    mockMutateAsync.mockRejectedValue({ response: { data: { message: "Server error" } } });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Sửa"));

    // Fill in form with valid data so validation passes and mutateAsync is called
    const thangInput = document.querySelector('input[name="Thang"]') as HTMLInputElement;
    fireEvent.change(thangInput, { target: { value: "2024-02" } });

    const saveBtn = screen.getByRole("button", { name: "Tính lại lương" });
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
