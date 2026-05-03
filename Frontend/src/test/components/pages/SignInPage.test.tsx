import { render, screen, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import SignInPage from "@/pages/SignInPage";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

// Mock at module level – vi.mock is hoisted
vi.mock("@/components/auth/SignIn", () => ({
  SignInFrom: () => <div data-testid="signin-form">SignInForm</div>,
}));

// ThemeProvider mock is reset in each test via mockReturnValue
vi.mock("@/components/systems/ThemeProvider");

const mockUseTheme = vi.fn();

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("@/components/systems/ThemeProvider");
  (mod.useTheme as any) = mockUseTheme;
  mockUseTheme.mockReturnValue({ theme: "light" });
});

const renderComponent = () =>
  render(
    <MemoryRouter>
      <SignInPage />
    </MemoryRouter>
  );

describe("SignInPage", () => {
  test("renders SignInFrom component", () => {
    renderComponent();
    expect(screen.getByTestId("signin-form")).toBeInTheDocument();
  });

  test("renders with gradient background container", () => {
    const { container } = renderComponent();
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.className).toContain("flex");
    expect(outerDiv.className).toContain("min-h-svh");
  });

  test("renders SignInForm text content", () => {
    renderComponent();
    expect(screen.getByText("SignInForm")).toBeInTheDocument();
  });

  test("cleanup adds light class on setTimeout and unmount restores light theme", async () => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const { unmount } = renderComponent();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(root.classList.contains("light")).toBe(true);

    unmount();
    // cleanup sets light (theme is 'light')
    expect(root.classList.contains("light")).toBe(true);
  });

  test("cleanup restores system-detected dark theme on unmount", async () => {
    // Simulate system dark preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true, // dark mode
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    mockUseTheme.mockReturnValue({ theme: "system" });

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const { unmount } = renderComponent();
    unmount();
    // after unmount with system+dark preference, dark should be applied
    expect(root.classList.contains("dark")).toBe(true);
  });
});
