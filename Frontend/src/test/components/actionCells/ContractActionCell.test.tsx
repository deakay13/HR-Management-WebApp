import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ContractActionCell } from "@/components/actionCells/informations/ContractActionCell";
import { TestQueryProvider } from "../../queries/queryTestUtils";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useUpdateContractMutation, useDeleteContractMutation } from "@/hooks/queries/useContractsQuery";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/hooks/queries/useContractsQuery");
vi.mock("@/hooks/queries/useEmployeesQuery");

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

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

if (typeof window !== 'undefined') {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe("ContractActionCell", () => {
  const mockContract = {
    MaHopDong: "HD01",
    MaNV: "NV01",
    LoaiHD: "Fulltime",
    NgayBatDau: "2024-01-01",
    NgayKetThuc: "2025-01-01",
    NgayKy: "2024-01-01",
    ChucDanh: "Nhan vien",
    MaPB: "P01",
    MaLCB: "L01",
    MaPC: "PC01",
    HinhThucTraLuong: "Chuyen khoan",
    TinhTrang: "Hieu luc",
    createdAt: "2024",
    updatedAt: "2024"
  };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    
    (useUpdateContractMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useDeleteContractMutation as any).mockReturnValue({ mutateAsync: mockMutateAsync });
    (useEmployeesQuery as any).mockReturnValue({ data: { data: [{ MaNV: "NV01" }] } });
    
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
        <ContractActionCell contract={mockContract as any} />
      </TestQueryProvider>
    );
  };

  test("Returns null if no write permissions", () => {
    (useAuthorizeStore as any).mockReturnValue({ permissions: [{ TenQuyen: "Đọc" }] });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("Renders action cell and can open update dialog and submit", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const editMenu = await screen.findByText("Sửa");
    await user.click(editMenu);

    expect(screen.getByLabelText("Mã HĐ")).toHaveValue("HD01");

    const input = screen.getByLabelText("Loại HĐ");
    fireEvent.change(input, { target: { value: "Parttime" } });

    const inputNgayBD = screen.getByLabelText("Ngày Bắt Đầu");
    fireEvent.change(inputNgayBD, { target: { value: "2024-01-01" } });
    
    const inputNgayKT = screen.getByLabelText("Ngày Kết Thúc");
    fireEvent.change(inputNgayKT, { target: { value: "2024-12-31" } });

    const inputNgayKy = screen.getByLabelText("Ngày Ký");
    fireEvent.change(inputNgayKy, { target: { value: "2024-01-01" } });

    const inputChucDanh = screen.getByLabelText("Chức Danh");
    fireEvent.change(inputChucDanh, { target: { value: "Developer" } });

    const inputMaPB = screen.getByLabelText("Mã PB");
    fireEvent.change(inputMaPB, { target: { value: "PB01" } });

    const inputMaLCB = screen.getByLabelText("Mã LCB");
    fireEvent.change(inputMaLCB, { target: { value: "LCB01" } });

    const inputMaPC = screen.getByLabelText("Mã PC");
    fireEvent.change(inputMaPC, { target: { value: "PC01" } });

    const inputHinhThuc = screen.getByLabelText("Hình Thức Trả Lương");
    fireEvent.change(inputHinhThuc, { target: { value: "Chuyển khoản" } });

    const inputTinhTrang = screen.getByLabelText("Tình Trạng");
    fireEvent.change(inputTinhTrang, { target: { value: "Đang hiệu lực" } });

    const fileInput = screen.getByLabelText("Hình Ảnh Hợp Đồng (PDF)");
    const file = new File(["test file"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  test("Renders action cell and can open delete dialog", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const deleteMenu = await screen.findByText("Xoá");
    await user.click(deleteMenu);

    const deleteBtn = screen.getByRole("button", { name: "Xoá" });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("HD01");
    });
  });

  test("Shows only delete option when canUpdate=false", async () => {
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Xoá" }] // no Sửa
    });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("Sửa")).not.toBeInTheDocument();
    expect(screen.getByText("Xoá")).toBeInTheDocument();
  });

  test("Shows validation error when form submitted with invalid MaNV", async () => {
    const user = userEvent.setup();
    renderComponent();

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const editMenu = await screen.findByText("Sửa");
    await user.click(editMenu);

    // Clear MaNV to cause validation error (empty employee code)
    const maNVInput = screen.getByLabelText("Mã NV");
    fireEvent.change(maNVInput, { target: { value: "" } });

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    fireEvent.click(saveBtn);

    // mutateAsync should NOT be called (validation failed)
    await waitFor(() => expect(mockMutateAsync).not.toHaveBeenCalled());
  });
});
