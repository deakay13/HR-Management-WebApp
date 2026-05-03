import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import DeductionComponents from "@/components/workspaces/DeductionsComponents";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useDeductionsQuery } from "@/hooks/queries/usePayrollQueries";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/hooks/queries/usePayrollQueries", () => ({
  useAllowancesQuery: vi.fn(),
  useBaseSalariesQuery: vi.fn(),
  useDeductionsQuery: vi.fn(),
  useHoursQuery: vi.fn(),
  usePayrollsQuery: vi.fn(),
}));
vi.mock("@/components/table/workspaceTable/DeductionTable", () => ({
  DeductionTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="deduction-table">DeductionTable: {data.length} rows</div>
  ),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DeductionComponents />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("DeductionsComponents", () => {
  beforeEach(() => vi.clearAllMocks());

  test("shows loading state when no accessToken", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (useDeductionsQuery as any).mockReturnValue({ data: undefined, isLoading: false });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("shows loading state when isLoading is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useDeductionsQuery as any).mockReturnValue({ data: undefined, isLoading: true });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("renders DeductionTable with data", () => {
    const mockData = [{ MaKT: "KT001" }, { MaKT: "KT002" }];
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useDeductionsQuery as any).mockReturnValue({ data: { data: mockData }, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("deduction-table")).toBeInTheDocument();
    expect(screen.getByText(/DeductionTable: 2 rows/)).toBeInTheDocument();
  });

  test("renders DeductionTable with empty array when no data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useDeductionsQuery as any).mockReturnValue({ data: null, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("deduction-table")).toBeInTheDocument();
    expect(screen.getByText(/DeductionTable: 0 rows/)).toBeInTheDocument();
  });
});
