import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "@/components/systems/ThemeProvider";

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("provides default theme and language", () => {
    const TestComponent = () => {
      const { theme, language } = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <span data-testid="language">{language}</span>
        </div>
      );
    };

    render(
      <ThemeProvider defaultTheme="light" storageKey="ui-theme" defaultLanguage="vi">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("language").textContent).toBe("vi");
  });

  test("allows changing theme and language", () => {
    const TestComponent = () => {
      const { theme, setTheme, language, setLanguage } = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <span data-testid="language">{language}</span>
          <button onClick={() => setTheme("dark")}>Set Dark</button>
          <button onClick={() => setLanguage("en")}>Set EN</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Set Dark"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");

    fireEvent.click(screen.getByText("Set EN"));
    expect(screen.getByTestId("language").textContent).toBe("en");
  });
});
