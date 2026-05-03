import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import DashboardComponents from "@/components/workspaces/DashboardComponents";
import { useAccountsStore } from "@/stores/authStores/accountStore";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

vi.mock("@/stores/authStores/accountStore", () => ({ useAccountsStore: vi.fn() }));
vi.mock("@/components/dashboard/section-cards", () => ({
  SectionCards: () => <div data-testid="section-cards">SectionCards</div>,
}));
vi.mock("@/components/dashboard/chart-area-interactive", () => ({
  ChartAreaInteractive: () => <div data-testid="chart-area">ChartArea</div>,
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardComponents />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("DashboardComponents", () => {
  const getAccountsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAccountsStore as any).mockReturnValue({ getAccounts: getAccountsMock });
  });

  test("calls getAccounts on mount", () => {
    renderComponent();
    expect(getAccountsMock).toHaveBeenCalledTimes(1);
  });

  test("renders SectionCards component", () => {
    renderComponent();
    expect(screen.getByTestId("section-cards")).toBeInTheDocument();
  });

  test("renders ChartAreaInteractive component", () => {
    renderComponent();
    expect(screen.getByTestId("chart-area")).toBeInTheDocument();
  });

  test("renders both dashboard sections together", () => {
    renderComponent();
    expect(screen.getByTestId("section-cards")).toBeInTheDocument();
    expect(screen.getByTestId("chart-area")).toBeInTheDocument();
  });
});
