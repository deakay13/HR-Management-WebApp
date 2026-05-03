import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { NavDocuments } from "@/components/navMenu/NavManagements";
import { useSidebar } from "@/components/ui/sidebar";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({ children, className }: any) => <div className={className} data-testid="sidebar-group">{children}</div>,
  SidebarGroupLabel: ({ children }: any) => <div>{children}</div>,
  SidebarMenu: ({ children }: any) => <div data-testid="sidebar-menu">{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div data-testid="sidebar-menu-item">{children}</div>,
  SidebarMenuButton: ({ children, isActive, onClick, disabled }: any) => (
    <button data-testid="sidebar-menu-button" data-active={isActive} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  useSidebar: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("NavDocuments (NavManagements)", () => {
  let mockSetOpenMobile: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetOpenMobile = vi.fn();
    (useSidebar as any).mockReturnValue({ isMobile: false, setOpenMobile: mockSetOpenMobile });
  });

  const mockItems = [
    { name: "Doc 1", url: "/doc1", icon: () => <svg data-testid="icon1" /> },
    { name: "Doc 2", url: "/doc2", icon: () => <svg data-testid="icon2" />, disabled: true },
  ];

  test("renders active and inactive items", () => {
    render(
      <MemoryRouter initialEntries={["/doc1"]}>
        <NavDocuments items={mockItems} />
      </MemoryRouter>
    );

    expect(screen.getByText("Phân Quyền")).toBeInTheDocument();
    
    // Check first item (active)
    const buttons = screen.getAllByTestId("sidebar-menu-button");
    expect(buttons[0]).toHaveAttribute("data-active", "true");
    expect(screen.getByText("Doc 1")).toBeInTheDocument();
    expect(screen.getByTestId("icon1")).toBeInTheDocument();

    // Check second item (disabled)
    expect(buttons[1]).toBeDisabled();
    expect(screen.getByText("Doc 2")).toBeInTheDocument();
    expect(screen.getByTestId("icon2")).toBeInTheDocument();
  });

  test("closes mobile menu when clicked on mobile", () => {
    (useSidebar as any).mockReturnValue({ isMobile: true, setOpenMobile: mockSetOpenMobile });
    
    render(
      <MemoryRouter initialEntries={["/doc3"]}>
        <NavDocuments items={mockItems} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByTestId("sidebar-menu-button");
    fireEvent.click(buttons[0]);
    
    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
  });

  test("does not close mobile menu when clicked on desktop", () => {
    (useSidebar as any).mockReturnValue({ isMobile: false, setOpenMobile: mockSetOpenMobile });
    
    render(
      <MemoryRouter initialEntries={["/doc3"]}>
        <NavDocuments items={mockItems} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByTestId("sidebar-menu-button");
    fireEvent.click(buttons[0]);
    
    expect(mockSetOpenMobile).not.toHaveBeenCalled();
  });
});
