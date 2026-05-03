import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import RolesComponents from "@/components/managements/RolesComponents";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useGrantPermissionsStore } from "@/stores/permissionStores/grantPermissionsStore";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

vi.mock("@/stores/permissionStores/rolesStore", () => ({ useRolesStore: vi.fn() }));
vi.mock("@/stores/permissionStores/grantPermissionsStore", () => ({ useGrantPermissionsStore: vi.fn() }));
vi.mock("@/stores/permissionStores/permissionsStore", () => ({ usePermissionsStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/components/table/managementsTable/RolesTable", () => ({
  RolesTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="roles-table">
      RolesTable: {data?.length || 0} rows. 
      First role permissions: {(data as any)?.[0]?.permissions?.length || 0}
    </div>
  ),
}));

describe("RolesComponents", () => {
  let mockGetRoles: any;
  let mockGetGrantPermissions: any;
  let mockGetPermissions: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRoles = vi.fn();
    mockGetGrantPermissions = vi.fn();
    mockGetPermissions = vi.fn();
    
    (usePermissionsStore as any).mockReturnValue({ getPermissions: mockGetPermissions });
  });

  test("shows loading state when rolesLoading is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (useRolesStore as any).mockReturnValue({ Roles: [], initializing: true, getRoles: mockGetRoles });
    (useGrantPermissionsStore as any).mockReturnValue({ GrantPermissions: [], initializing: false, getGrantPermissions: mockGetGrantPermissions });
    
    render(<RolesComponents />);
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("shows loading state when gpLoading is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (useRolesStore as any).mockReturnValue({ Roles: [], initializing: false, getRoles: mockGetRoles });
    (useGrantPermissionsStore as any).mockReturnValue({ GrantPermissions: [], initializing: true, getGrantPermissions: mockGetGrantPermissions });
    
    render(<RolesComponents />);
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("calls APIs when accessToken exists", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    (useRolesStore as any).mockReturnValue({ Roles: [], initializing: false, getRoles: mockGetRoles });
    (useGrantPermissionsStore as any).mockReturnValue({ GrantPermissions: [], initializing: false, getGrantPermissions: mockGetGrantPermissions });
    
    render(<RolesComponents />);
    await waitFor(() => {
      expect(mockGetRoles).toHaveBeenCalledTimes(1);
      expect(mockGetGrantPermissions).toHaveBeenCalledTimes(1);
      expect(mockGetPermissions).toHaveBeenCalledTimes(1);
    });
  });

  test("does not call APIs when no accessToken", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null });
    (useRolesStore as any).mockReturnValue({ Roles: [], initializing: false, getRoles: mockGetRoles });
    (useGrantPermissionsStore as any).mockReturnValue({ GrantPermissions: [], initializing: false, getGrantPermissions: mockGetGrantPermissions });
    
    render(<RolesComponents />);
    await waitFor(() => {
      expect(mockGetRoles).not.toHaveBeenCalled();
      expect(mockGetGrantPermissions).not.toHaveBeenCalled();
      expect(mockGetPermissions).not.toHaveBeenCalled();
    });
  });

  test("renders RolesTable with merged data", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token" });
    const mockRoles = [{ MaVT: "VT1", TenVaiTro: "Role 1" }];
    const mockGrantPermissions = [{ MaVT: "VT1", permissions: ["P1", "P2"] }];
    
    (useRolesStore as any).mockReturnValue({ Roles: mockRoles, initializing: false, getRoles: mockGetRoles });
    (useGrantPermissionsStore as any).mockReturnValue({ GrantPermissions: mockGrantPermissions, initializing: false, getGrantPermissions: mockGetGrantPermissions });
    
    render(<RolesComponents />);
    expect(screen.getByTestId("roles-table")).toBeInTheDocument();
    expect(screen.getByText(/RolesTable: 1 rows/)).toBeInTheDocument();
    expect(screen.getByText(/First role permissions: 2/)).toBeInTheDocument();
  });
});
