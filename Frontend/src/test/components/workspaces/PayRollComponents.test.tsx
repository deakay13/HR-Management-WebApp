import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import PayRollComponents from "@/components/workspaces/PayRollComponents";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { usePayrollsQuery } from "@/hooks/queries/usePayrollQueries";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthorizeStore", () => ({ useAuthorizeStore: vi.fn() }));
vi.mock("@/hooks/queries/usePayrollQueries", () => ({
  useAllowancesQuery: vi.fn(),
  useBaseSalariesQuery: vi.fn(),
  useDeductionsQuery: vi.fn(),
  useHoursQuery: vi.fn(),
  usePayrollsQuery: vi.fn(),
}));
vi.mock("@/components/table/workspaceTable/PayRollTable", () => ({
  PayRollTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="payroll-table">PayRollTable: {data.length} rows</div>
  ),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PayRollComponents />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("PayRollComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthorizeStore as any).mockReturnValue("VT001");
  });

  test("returns null when no accessToken", () => {
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({ accessToken: null, account: null })
    );
    (usePayrollsQuery as any).mockReturnValue({ data: undefined, isLoading: false });
    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  test("shows loading state when isLoading is true", () => {
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({ accessToken: "token123", account: { MaNV: "NV001" } })
    );
    (usePayrollsQuery as any).mockReturnValue({ data: undefined, isLoading: true });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("renders PayRollTable with data", () => {
    const mockData = [{ MaBL: "BL001" }, { MaBL: "BL002" }];
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({ accessToken: "token123", account: { MaNV: "NV001" } })
    );
    (usePayrollsQuery as any).mockReturnValue({ data: { data: mockData }, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("payroll-table")).toBeInTheDocument();
    expect(screen.getByText(/PayRollTable: 2 rows/)).toBeInTheDocument();
  });

  test("renders PayRollTable with empty array when no data", () => {
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({ accessToken: "token123", account: { MaNV: "NV001" } })
    );
    (usePayrollsQuery as any).mockReturnValue({ data: null, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("payroll-table")).toBeInTheDocument();
    expect(screen.getByText(/PayRollTable: 0 rows/)).toBeInTheDocument();
  });
});
