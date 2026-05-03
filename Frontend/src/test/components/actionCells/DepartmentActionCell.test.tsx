import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { DepartmentActionCell } from "@/components/actionCells/informations/DepartmentActionCell";
import { TestQueryProvider } from "../../queries/queryTestUtils";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useUpdateDepartmentMutation, useDeleteDepartmentMutation } from "@/hooks/queries/useDepartmentsQuery";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/hooks/queries/useDepartmentsQuery");

// Prevent i18n crash
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Polyfill PointerEvent for Radix UI
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
    }
  }
  window.PointerEvent = PointerEvent as any;
}

// Polyfill ResizeObserver
if (typeof window !== 'undefined') {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe("DepartmentActionCell", () => {
  const mockDept = { MaPB: "P01", TenPB: "IT", createdAt: "2024", updatedAt: "2024" };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    
    (useUpdateDepartmentMutation as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
    
    (useDeleteDepartmentMutation as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
    
    // Default to full permissions
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [
        { TenQuyen: "Tạo" },
        { TenQuyen: "Đọc" },
        { TenQuyen: "Sửa" },
        { TenQuyen: "Xoá" },
      ]
    });
  });

  const renderComponent = () => {
    return render(
      <TestQueryProvider>
        <DepartmentActionCell dept={mockDept} />
      </TestQueryProvider>
    );
  };

  test("Returns null if no write permissions", () => {
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Đọc" }]
    });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders action cell and can open update dialog", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    // Dropdown menu opens, click "Sửa"
    const editMenu = await screen.findByText("Sửa");
    await user.click(editMenu);

    // Dialog opens, check initial values
    expect(screen.getByLabelText("Mã Phòng Ban")).toHaveValue("P01");
    expect(screen.getByLabelText("Tên Phòng Ban")).toHaveValue("IT");

    // Clear and type new value
    const input = screen.getByLabelText("Tên Phòng Ban");
    await user.clear(input);
    
    // Zod error simulation: if left empty and save is clicked
    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    await user.click(saveBtn);

    // Expect zod validation error (from your zod schema, TenPB min 1)
    await waitFor(() => {
      expect(screen.getByText("Tên phòng ban phải từ 2 ký tự")).toBeInTheDocument();
    });

    // Type valid data
    await user.type(input, "HR");
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: "P01",
        data: { TenPB: "HR" }
      });
    });
  });

  test("Renders action cell and can open delete dialog", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    // Dropdown menu opens, click "Xoá"
    const deleteMenu = await screen.findByText("Xoá");
    await user.click(deleteMenu);

    // Dialog opens
    const confirmText = screen.getByText((content) => content.includes("Bạn có chắc muốn xoá phòng ban"));
    expect(confirmText).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: "Xoá" });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("P01");
    });
  });
});
