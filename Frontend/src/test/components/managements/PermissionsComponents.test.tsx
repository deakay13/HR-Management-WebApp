import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import PermissionsComponents from "@/components/managements/PermissionsComponents";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

vi.mock("@/stores/permissionStores/permissionsStore", () => ({ usePermissionsStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/components/table/managementsTable/PermissionsTable", () => ({
  PermissionsTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="permissions-table">PermissionsTable: {data?.length || 0} rows</div>
  ),
}));

describe("PermissionsComponents", () => {
  let mockGetPermissions: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPermissions = vi.fn();
  });

  test("shows loading state when initializing is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (usePermissionsStore as any).mockReturnValue({ 
      Permissions: [], 
      initializing: true, 
      getPermissions: mockGetPermissions 
    });
    
    render(<PermissionsComponents />);
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("calls getPermissions when accessToken exists", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (usePermissionsStore as any).mockReturnValue({ 
      Permissions: [], 
      initializing: false, 
      getPermissions: mockGetPermissions 
    });
    
    render(<PermissionsComponents />);
    await waitFor(() => {
      expect(mockGetPermissions).toHaveBeenCalledTimes(1);
    });
  });

  test("does not call getPermissions when no accessToken", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (usePermissionsStore as any).mockReturnValue({ 
      Permissions: [], 
      initializing: false, 
      getPermissions: mockGetPermissions 
    });
    
    render(<PermissionsComponents />);
    await waitFor(() => {
      expect(mockGetPermissions).not.toHaveBeenCalled();
    });
  });

  test("renders PermissionsTable with data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (usePermissionsStore as any).mockReturnValue({ 
      Permissions: [{ MaQuyen: "Q1" }], 
      initializing: false, 
      getPermissions: mockGetPermissions 
    });
    
    render(<PermissionsComponents />);
    expect(screen.getByTestId("permissions-table")).toBeInTheDocument();
    expect(screen.getByText(/PermissionsTable: 1 rows/)).toBeInTheDocument();
  });
});
