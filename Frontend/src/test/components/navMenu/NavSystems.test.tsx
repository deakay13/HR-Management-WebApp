import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { NavSecondary } from "@/components/navMenu/NavSystems";

const mockSetOpenMobile = vi.fn();
const mockUseSidebar = vi.fn();

vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({ children, className }: any) => <div className={className} data-testid="sidebar-group">{children}</div>,
  SidebarGroupContent: ({ children }: any) => <div>{children}</div>,
  SidebarGroupLabel: ({ children }: any) => <div>{children}</div>,
  SidebarMenu: ({ children }: any) => <div data-testid="sidebar-menu">{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div data-testid="sidebar-menu-item">{children}</div>,
  SidebarMenuButton: ({ children, isActive, onClick, disabled }: any) => (
    <button data-testid="sidebar-menu-button" data-active={isActive} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  useSidebar: () => mockUseSidebar(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("NavSecondary (NavSystems)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems = [
    { name: "System 1", url: "/sys1", icon: () => <svg data-testid="icon1" /> },
    { name: "System 2", url: "/sys2", icon: () => <svg data-testid="icon2" /> },
  ];

  test("renders systems items correctly with active state", () => {
    mockUseSidebar.mockReturnValue({ isMobile: false, setOpenMobile: mockSetOpenMobile });
    render(
      <MemoryRouter initialEntries={["/sys2"]}>
        <NavSecondary items={mockItems} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByTestId("sidebar-menu-button");
    expect(buttons).toHaveLength(2);
    
    // First item
    expect(screen.getByText("System 1")).toBeInTheDocument();
    
    // Second item should be active based on url
    expect(screen.getByText("System 2")).toBeInTheDocument();
    expect(buttons[1]).toHaveAttribute("data-active", "true");
  });

  test("does NOT call setOpenMobile when not on mobile", () => {
    mockUseSidebar.mockReturnValue({ isMobile: false, setOpenMobile: mockSetOpenMobile });
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavSecondary items={mockItems} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByTestId("sidebar-menu-button");
    fireEvent.click(buttons[0]);
    
    expect(mockSetOpenMobile).not.toHaveBeenCalled();
  });

  test("calls setOpenMobile(false) when on mobile", () => {
    mockUseSidebar.mockReturnValue({ isMobile: true, setOpenMobile: mockSetOpenMobile });
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavSecondary items={mockItems} />
      </MemoryRouter>
    );

    const buttons = screen.getAllByTestId("sidebar-menu-button");
    fireEvent.click(buttons[0]);
    
    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
  });
});
