import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ContractTable } from "@/components/table/informationsTable/ContractTable";
import { MemoryRouter } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { ContractServices } from "@/services/informationServices/contractServices";
import i18n from "@/i18n";

vi.mock("@/stores/authStores/useAuthorizeStore");
vi.mock("@/services/informationServices/contractServices", () => ({
  ContractServices: {
    exportContract: vi.fn(),
  }
}));
vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Mock Dialog Component since we only test Table
vi.mock("@/components/table/informationsTable/dialogs/CreateContractDialog", () => ({
  CreateContractDialog: ({ open, onOpenChange }: any) => {
    return open ? (
      <div data-testid="create-contract-dialog">
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null;
  }
}));

// Mock ActionCell to avoid rendering complex mutations and forms
vi.mock("@/components/actionCells/informations/ContractActionCell", () => ({
  ContractActionCell: () => <div data-testid="contract-action-cell" />
}));

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
  window.URL.createObjectURL = vi.fn();
}

describe("ContractTable", () => {
  const mockData = [
    { MaHopDong: "HD01", MaNV: "NV01", LoaiHD: "Thử việc" },
    { MaHopDong: "HD02", MaNV: "NV02", LoaiHD: "Chính thức" },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (useAuthorizeStore as any).mockReturnValue({
      permissions: [{ TenQuyen: "Tạo" }, { TenQuyen: "Đọc" }, { TenQuyen: "Sửa" }, { TenQuyen: "Xoá" }]
    });
  });

  const renderComponent = (props: any = {}) => render(
    <MemoryRouter>
      <ContractTable data={mockData as any} {...props} />
    </MemoryRouter>
  );

  test("renders loading state", () => {
    renderComponent({ loading: true });
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  test("renders empty state", () => {
    renderComponent({ data: [] });
    expect(screen.getByText("Không có dữ liệu.")).toBeInTheDocument();
  });

  test("renders data rows", () => {
    renderComponent();
    expect(screen.getByText("HD01")).toBeInTheDocument();
    expect(screen.getByText("HD02")).toBeInTheDocument();
  });

  test("can trigger export excel", async () => {
    const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    (ContractServices.exportContract as any).mockResolvedValue(mockBlob);

    const user = userEvent.setup();
    renderComponent();
    
    const exportBtn = screen.getByTitle("Xuất Excel");
    await user.click(exportBtn);

    expect(ContractServices.exportContract).toHaveBeenCalled();
  });

  test("can open create dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const createBtn = screen.getByRole("button", { name: "Tạo mới" });
    await user.click(createBtn);

    expect(screen.getByTestId("create-contract-dialog")).toBeInTheDocument();
  });
});
