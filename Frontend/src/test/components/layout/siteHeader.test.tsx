import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { SiteHeader } from "@/components/layout/siteHeader";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: ({ className }: any) => <button className={className} data-testid="sidebar-trigger">Trigger</button>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: ({ className, orientation }: any) => (
    <div className={className} data-testid="separator" data-orientation={orientation}>Separator</div>
  ),
}));

describe("SiteHeader", () => {
  test("renders SiteHeader correctly", () => {
    render(<SiteHeader />);
    
    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
    
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });
});
