import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import EmployeeComponents from "@/components/workspaces/EmployeesComponents";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/hooks/queries/useEmployeesQuery", () => ({ useEmployeesQuery: vi.fn() }));
vi.mock("@/components/table/informationsTable/EmployeeTable", () => ({
  EmployeeTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="employee-table">EmployeeTable: {data.length} rows</div>
  ),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EmployeeComponents />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("EmployeesComponents", () => {
  beforeEach(() => vi.clearAllMocks());

  test("shows loading state when no accessToken", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (useEmployeesQuery as any).mockReturnValue({ data: undefined, isLoading: false });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("shows loading state when isLoading is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useEmployeesQuery as any).mockReturnValue({ data: undefined, isLoading: true });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("renders EmployeeTable with data (array in data.data)", () => {
    const mockEmployees = [{ MaNV: "NV001" }, { MaNV: "NV002" }, { MaNV: "NV003" }];
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useEmployeesQuery as any).mockReturnValue({ data: { data: mockEmployees }, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("employee-table")).toBeInTheDocument();
    expect(screen.getByText(/EmployeeTable: 3 rows/)).toBeInTheDocument();
  });

  test("renders EmployeeTable with empty array when no data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useEmployeesQuery as any).mockReturnValue({ data: null, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("employee-table")).toBeInTheDocument();
    expect(screen.getByText(/EmployeeTable: 0 rows/)).toBeInTheDocument();
  });
});
