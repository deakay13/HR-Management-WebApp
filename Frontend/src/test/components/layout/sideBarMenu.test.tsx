import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AppSidebar } from "@/components/layout/sideBarMenu";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));

vi.mock("@/components/navMenu/NavManagements", () => ({
  NavDocuments: () => <div data-testid="nav-documents">NavDocuments</div>,
}));

vi.mock("@/components/navMenu/NavWorkspaces", () => ({
  NavMain: () => <div data-testid="nav-main">NavMain</div>,
}));

vi.mock("@/components/navMenu/NavSystems", () => ({
  NavSecondary: () => <div data-testid="nav-secondary">NavSecondary</div>,
}));

vi.mock("@/components/navMenu/NavUserMini", () => ({
  NavUserMini: () => <div data-testid="nav-user-mini">NavUserMini</div>,
}));

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children, ...props }: any) => <div data-testid="sidebar" {...props}>{children}</div>,
  SidebarContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
  SidebarFooter: ({ children }: any) => <div data-testid="sidebar-footer">{children}</div>,
  SidebarHeader: ({ children }: any) => <div data-testid="sidebar-header">{children}</div>,
  SidebarMenu: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: any) => <button>{children}</button>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
}));

describe("AppSidebar (sideBarMenu)", () => {
  test("renders sidebar structure with mocked navigation components", () => {
    (useAuthStore as any).mockReturnValue({ account: { HoTen: "Admin" } });
    
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
    
    expect(screen.getByTestId("nav-main")).toBeInTheDocument();
    expect(screen.getByTestId("nav-documents")).toBeInTheDocument();
    expect(screen.getByTestId("nav-secondary")).toBeInTheDocument();
    expect(screen.getByTestId("nav-user-mini")).toBeInTheDocument();
  });
});
