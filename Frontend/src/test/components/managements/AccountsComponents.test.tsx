import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import AccountsComponents from "@/components/managements/AccountsComponents";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

vi.mock("@/stores/authStores/accountStore", () => ({ useAccountsStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/components/table/managementsTable/AccountsTable", () => ({
  AccountsTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="accounts-table">AccountsTable: {data?.length || 0} rows</div>
  ),
}));

describe("AccountsComponents", () => {
  let mockGetAccounts: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAccounts = vi.fn();
  });

  test("shows loading state when initializing is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (useAccountsStore as any).mockReturnValue({ 
      accounts: [], 
      initializing: true, 
      getAccounts: mockGetAccounts 
    });
    
    render(<AccountsComponents />);
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("calls getAccounts when accessToken exists", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (useAccountsStore as any).mockReturnValue({ 
      accounts: [], 
      initializing: false, 
      getAccounts: mockGetAccounts 
    });
    
    render(<AccountsComponents />);
    await waitFor(() => {
      expect(mockGetAccounts).toHaveBeenCalledTimes(1);
    });
  });

  test("does not call getAccounts when no accessToken", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (useAccountsStore as any).mockReturnValue({ 
      accounts: [], 
      initializing: false, 
      getAccounts: mockGetAccounts 
    });
    
    render(<AccountsComponents />);
    await waitFor(() => {
      expect(mockGetAccounts).not.toHaveBeenCalled();
    });
  });

  test("renders AccountsTable with data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (useAccountsStore as any).mockReturnValue({ 
      accounts: [{ MaTK: "TK1" }, { MaTK: "TK2" }], 
      initializing: false, 
      getAccounts: mockGetAccounts 
    });
    
    render(<AccountsComponents />);
    expect(screen.getByTestId("accounts-table")).toBeInTheDocument();
    expect(screen.getByText(/AccountsTable: 2 rows/)).toBeInTheDocument();
  });
});
