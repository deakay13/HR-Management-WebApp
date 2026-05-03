import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { NavUserMini } from "@/components/navMenu/NavUserMini";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenu: ({ children }: any) => <div data-testid="sidebar-menu">{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div data-testid="sidebar-menu-item">{children}</div>,
  SidebarMenuButton: ({ children }: any) => <button data-testid="sidebar-menu-button">{children}</button>,
  useSidebar: vi.fn().mockReturnValue({ isMobile: false }),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarFallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>,
  AvatarImage: ({ src }: any) => <img src={src} data-testid="avatar-image" alt="avatar" />,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuGroup: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <div data-testid="dropdown-item" onClick={onClick}>{children}</div>,
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}));

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("@/stores/authStores/useAuthorizeStore", () => ({ useAuthorizeStore: vi.fn() }));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NavUserMini", () => {
  let mockSignOut: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut = vi.fn().mockResolvedValue(true);
    
    (useAuthStore as any).mockReturnValue({
      account: { NhanVien: { HoVaTen: "John Doe" }, TenTaiKhoan: "johndoe" },
      avatarUrl: "http://example.com/avatar.png",
      signOut: mockSignOut,
    });
    
    (useAuthorizeStore as any).mockReturnValue({
      role: { TenVaiTro: "Admin" }
    });
  });

  test("renders nothing if account is null", () => {
    (useAuthStore as any).mockReturnValue({ account: null });
    const { container } = render(<MemoryRouter><NavUserMini /></MemoryRouter>);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders user info correctly", () => {
    render(<MemoryRouter><NavUserMini /></MemoryRouter>);
    
    expect(screen.getAllByText("John Doe")).toHaveLength(2);
    expect(screen.getAllByText("Admin")).toHaveLength(2);
  });

  test("handles sign out correctly", async () => {
    render(<MemoryRouter><NavUserMini /></MemoryRouter>);
    
    const items = screen.getAllByTestId("dropdown-item");
    // Find the sign out item (usually the last one)
    const signOutItem = items[items.length - 1];
    
    fireEvent.click(signOutItem);
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });
  });

  test("handles sign out error gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockRejectedValue(new Error("Logout failed"));
    
    render(<MemoryRouter><NavUserMini /></MemoryRouter>);
    
    const items = screen.getAllByTestId("dropdown-item");
    fireEvent.click(items[items.length - 1]);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });

  test("navigates to profile page when profile item is clicked", () => {
    render(<MemoryRouter><NavUserMini /></MemoryRouter>);
    
    const items = screen.getAllByTestId("dropdown-item");
    // Profile item is the first dropdown item
    fireEvent.click(items[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith("/PortalPage/Profile");
  });

  test("renders TenTaiKhoan when NhanVien.HoVaTen is not available", () => {
    (useAuthStore as any).mockReturnValue({
      account: { NhanVien: null, TenTaiKhoan: "johndoe" },
      avatarUrl: null,
      signOut: mockSignOut,
    });
    
    render(<MemoryRouter><NavUserMini /></MemoryRouter>);
    
    expect(screen.getAllByText("johndoe")).toBeTruthy();
  });
});

