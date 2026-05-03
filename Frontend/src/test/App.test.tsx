import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import App from "@/App";

// Mocking the whole router and components to avoid complex render tree
vi.mock("react-router", () => ({
  BrowserRouter: ({ children }: any) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }: any) => <div data-testid="routes">{children}</div>,
  Route: ({ element, children }: any) => <div data-testid="route">{element}{children}</div>,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
  Link: ({ children }: any) => <a>{children}</a>,
  Outlet: () => <div></div>,
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}));

vi.mock("@/routes/AdminProtectedRoute", () => ({
  AdminProtectedRoute: ({ children }: any) => <div data-testid="admin-protected-route">{children}</div>,
}));

vi.mock("@/routes/RoleProtectedRoute", () => ({
  RoleProtectedRoute: ({ children }: any) => <div data-testid="role-protected-route">{children}</div>,
}));

vi.mock("@/routes/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: any) => <div data-testid="protected-route">{children}</div>,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
  Link: ({ children }: any) => <a>{children}</a>,
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}));

vi.mock("@/components/auth/ProtectedRoute", () => ({
  default: () => <div data-testid="protected-route"></div>,
}));
vi.mock("@/components/auth/RoleProtectedRoute", () => ({
  default: ({ children }: any) => <div data-testid="role-protected-route">{children}</div>,
}));
vi.mock("@/components/auth/ForbiddenPage", () => ({
  default: () => <div data-testid="forbidden-page"></div>,
}));

// Mock pages and components imported by App.tsx
vi.mock("@/pages/SignInPage", () => ({ default: () => <div data-testid="signin-page">SignIn</div> }));
vi.mock("@/pages/PortalPage", () => ({ default: () => <div data-testid="portal-page">Portal</div> }));

vi.mock("@/components/workspaces/DashboardComponents", () => ({ default: () => <div data-testid="dashboard"></div> }));
vi.mock("@/components/workspaces/ContractsComponents", () => ({ default: () => <div data-testid="contracts"></div> }));
vi.mock("@/components/workspaces/EmployeesComponents", () => ({ default: () => <div data-testid="employees"></div> }));
vi.mock("@/components/workspaces/DepartmentsComponents", () => ({ default: () => <div data-testid="departments"></div> }));
vi.mock("@/components/workspaces/WorkingHoursComponents", () => ({ default: () => <div data-testid="working-hours"></div> }));
vi.mock("@/components/workspaces/PayRollComponents", () => ({ default: () => <div data-testid="payroll"></div> }));
vi.mock("@/components/workspaces/BasicSalaryComponents", () => ({ default: () => <div data-testid="basic-salary"></div> }));
vi.mock("@/components/workspaces/AllowancesComponents", () => ({ default: () => <div data-testid="allowances"></div> }));
vi.mock("@/components/workspaces/DeductionsComponents", () => ({ default: () => <div data-testid="deductions"></div> }));

vi.mock("@/components/managements/AccountsComponents", () => ({ default: () => <div data-testid="accounts"></div> }));
vi.mock("@/components/managements/RolesComponents", () => ({ default: () => <div data-testid="roles"></div> }));
vi.mock("@/components/managements/PermissionsComponents", () => ({ default: () => <div data-testid="permissions"></div> }));

vi.mock("@/components/systems/GetHelpComponents", () => ({ default: () => <div data-testid="get-help"></div> }));
vi.mock("@/components/systems/SettingsComponents", () => ({ default: () => <div data-testid="settings"></div> }));
vi.mock("@/components/systems/profile/proFileComponent", () => ({ default: () => <div data-testid="profile"></div> }));

describe("App Component", () => {
  test("renders App with routing setup", () => {
    render(<App />);
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });
});
