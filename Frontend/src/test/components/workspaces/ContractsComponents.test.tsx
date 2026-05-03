import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import ContractComponents from "@/components/workspaces/ContractsComponents";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useContractsQuery } from "@/hooks/queries/useContractsQuery";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthorizeStore", () => ({ useAuthorizeStore: vi.fn() }));
vi.mock("@/hooks/queries/useContractsQuery", () => ({
  useContractsQuery: vi.fn(),
  useCreateContractMutation: vi.fn(),
}));
vi.mock("@/components/table/informationsTable/ContractTable", () => ({
  ContractTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="contract-table">ContractTable: {data.length} rows</div>
  ),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ContractComponents />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("ContractsComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthorizeStore as any).mockReturnValue("VT001");
  });

  test("shows loading state when no accessToken", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (useContractsQuery as any).mockReturnValue({ data: undefined, isLoading: false });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("shows loading state when isLoading is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useContractsQuery as any).mockReturnValue({ data: undefined, isLoading: true });
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("renders ContractTable with data", () => {
    const mockContracts = [{ MaHD: "HD001" }, { MaHD: "HD002" }];
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useContractsQuery as any).mockReturnValue({ data: { data: mockContracts }, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("contract-table")).toBeInTheDocument();
    expect(screen.getByText(/ContractTable: 2 rows/)).toBeInTheDocument();
  });

  test("renders ContractTable with empty array when no data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token123" });
    (useContractsQuery as any).mockReturnValue({ data: null, isLoading: false });
    renderComponent();
    expect(screen.getByTestId("contract-table")).toBeInTheDocument();
    expect(screen.getByText(/ContractTable: 0 rows/)).toBeInTheDocument();
  });
});
