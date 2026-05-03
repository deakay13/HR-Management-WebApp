import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import DashBoard from "@/pages/PortalPage";

vi.mock("@/components/layout/sideBarMenu", () => ({
  AppSidebar: () => <div data-testid="app-sidebar">AppSidebar</div>,
}));

vi.mock("@/components/layout/siteHeader", () => ({
  SiteHeader: () => <div data-testid="site-header">SiteHeader</div>,
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: any) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children }: any) => <div data-testid="sidebar-inset">{children}</div>,
}));

vi.mock("react-router", () => ({
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

describe("PortalPage", () => {
  test("renders DashBoard component with its children", () => {
    render(<DashBoard />);
    
    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-inset")).toBeInTheDocument();
    expect(screen.getByTestId("site-header")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });
});
