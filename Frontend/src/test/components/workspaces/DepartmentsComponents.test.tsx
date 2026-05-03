import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import DepartmentComponents from "@/components/workspaces/DepartmentsComponents";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthorizeStore", () => ({ useAuthorizeStore: vi.fn() }));
vi.mock("@/hooks/queries/useDepartmentsQuery", () => ({ useDepartmentsQuery: vi.fn() }));
vi.mock("@/components/table/informationsTable/DepartmentTable", () => ({
  DepartmentTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="department-table">DepartmentTable: {data.length} rows</div>
  ),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DepartmentComponents />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("DepartmentsComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthorizeStore as any).mockReturnValue("VT001");
  });

  test("shows loading state when no accessToken", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (useDepartmentsQuery as any).mockReturnValue({ data: undefined, isLoading: false });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("shows loading state when isLoading is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useDepartmentsQuery as any).mockReturnValue({ data: undefined, isLoading: true });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("renders DepartmentTable with data when loaded", () => {
    const mockDepts = [{ MaPB: "PB001" }, { MaPB: "PB002" }];
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useDepartmentsQuery as any).mockReturnValue({ data: { data: mockDepts }, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("department-table")).toBeInTheDocument();
    expect(screen.getByText(/DepartmentTable: 2 rows/)).toBeInTheDocument();
  });

  test("renders DepartmentTable with empty array when no data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useDepartmentsQuery as any).mockReturnValue({ data: null, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("department-table")).toBeInTheDocument();
    expect(screen.getByText(/DepartmentTable: 0 rows/)).toBeInTheDocument();
  });
});
