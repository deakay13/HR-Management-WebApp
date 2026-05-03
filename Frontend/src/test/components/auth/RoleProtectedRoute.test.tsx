import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";

vi.mock("@/stores/authStores/useAuthorizeStore", () => ({
  useAuthorizeStore: vi.fn(),
}));

const renderComponent = (allowedRoles: string[]) =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/403" element={<div data-testid="403-page">403 Forbidden</div>} />
        <Route element={<RoleProtectedRoute allowedRoles={allowedRoles} />}>
          <Route path="/protected" element={<div data-testid="protected-content">Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("RoleProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading state when initializing is true", () => {
    (useAuthorizeStore as any).mockImplementation((selector: any) => 
      selector({ role: null, initializing: true })
    );
    renderComponent(["Admin"]);
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  test("navigates to 403 when role is null", () => {
    (useAuthorizeStore as any).mockImplementation((selector: any) => 
      selector({ role: null, initializing: false })
    );
    renderComponent(["Admin"]);
    expect(screen.getByTestId("403-page")).toBeInTheDocument();
  });

  test("navigates to 403 when role is not in allowedRoles", () => {
    (useAuthorizeStore as any).mockImplementation((selector: any) => 
      selector({ role: { TenVaiTro: "User" }, initializing: false })
    );
    renderComponent(["Admin", "Manager"]);
    expect(screen.getByTestId("403-page")).toBeInTheDocument();
  });

  test("renders outlet when role is in allowedRoles", () => {
    (useAuthorizeStore as any).mockImplementation((selector: any) => 
      selector({ role: { TenVaiTro: "Admin" }, initializing: false })
    );
    renderComponent(["Admin", "Manager"]);
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });
});
