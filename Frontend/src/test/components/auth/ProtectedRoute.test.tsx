import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

const mocks = vi.hoisted(() => ({
  getState: vi.fn(),
}));

vi.mock("@/stores/authStores/useAuthStore", () => {
  const hook = vi.fn();
  (hook as any).getState = mocks.getState;
  return { useAuthStore: hook };
});

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/signin" element={<div data-testid="signin-page">SignIn</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div data-testid="protected-content">Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  let mockRefresh: any;
  let mockGetCurrentAccount: any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefresh = vi.fn();
    mockGetCurrentAccount = vi.fn();
  });

  test("shows loading state when initializing is true", () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null, account: null, initializing: true });
    mocks.getState.mockReturnValue({ accessToken: null, account: null, refresh: mockRefresh, getCurrentAccount: mockGetCurrentAccount });
    
    renderComponent();
    expect(screen.getByText("Đang tải trang...")).toBeInTheDocument();
  });

  test("navigates to signin when no accessToken after init", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: null, account: null, initializing: false });
    // First getState for init, second for after refresh
    mocks.getState.mockReturnValue({ accessToken: null, account: null, refresh: mockRefresh, getCurrentAccount: mockGetCurrentAccount });
    
    renderComponent();
    
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledWith(false);
      expect(screen.getByTestId("signin-page")).toBeInTheDocument();
    });
  });

  test("calls getCurrentAccount if accessToken exists but no account", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token", account: null, initializing: false });
    mocks.getState.mockReturnValue({ accessToken: "token", account: null, refresh: mockRefresh, getCurrentAccount: mockGetCurrentAccount });
    
    renderComponent();
    
    await waitFor(() => {
      expect(mockGetCurrentAccount).toHaveBeenCalled();
      expect(screen.getByTestId("signin-page")).toBeInTheDocument(); // still navigates because account is null in useAuthStore hook return
    });
  });

  test("renders outlet when accessToken and account exist", async () => {
    (useAuthStore as any).mockReturnValue({ accessToken: "token", account: { MaNV: "NV001" }, initializing: false });
    mocks.getState.mockReturnValue({ accessToken: "token", account: { MaNV: "NV001" }, refresh: mockRefresh, getCurrentAccount: mockGetCurrentAccount });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });
});
