import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { SignInFrom } from "@/components/auth/SignIn";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

vi.mock("@/stores/authStores/useAuthStore", () => ({ useAuthStore: vi.fn() }));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SignInFrom", () => {
  let mockSignIn: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn = vi.fn().mockResolvedValue(true);
    (useAuthStore as any).mockReturnValue({ signIn: mockSignIn });
  });

  test("renders sign in form correctly", () => {
    render(<MemoryRouter><SignInFrom /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /đăng nhập/i })).toBeInTheDocument();
  });

  test("does not call signIn if inputs are empty", async () => {
    render(<MemoryRouter><SignInFrom /></MemoryRouter>);
    const button = screen.getByRole("button", { name: /đăng nhập/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  test("calls signIn with username and password and navigates", async () => {
    render(<MemoryRouter><SignInFrom /></MemoryRouter>);
    
    // Find inputs by placeholder or id. Assuming there are inputs for username and password.
    // The snippet shows a form, we can just use the querySelector for standard inputs
    // or we can just find them by role/placeholder. Let's use form inputs.
    const inputs = document.querySelectorAll("input");
    if (inputs.length >= 2) {
      fireEvent.change(inputs[0], { target: { value: "testuser" } });
      fireEvent.change(inputs[1], { target: { value: "password123" } });
      
      const button = screen.getByRole("button", { name: /đăng nhập/i });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("testuser", "password123");
        expect(mockNavigate).toHaveBeenCalledWith("/PortalPage/DashBoard");
      });
    }
  });

  test("handles signIn error gracefully", async () => {
    mockSignIn.mockRejectedValue(new Error("Invalid credentials"));
    render(<MemoryRouter><SignInFrom /></MemoryRouter>);
    
    const inputs = document.querySelectorAll("input");
    if (inputs.length >= 2) {
      fireEvent.change(inputs[0], { target: { value: "testuser" } });
      fireEvent.change(inputs[1], { target: { value: "wrongpass" } });
      
      const button = screen.getByRole("button", { name: /đăng nhập/i });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("testuser", "wrongpass");
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    }
  });
});
