import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import AppearanceChilds from "@/components/systems/children/AppearanceChildren";
import { useTheme } from "@/components/systems/ThemeProvider";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/systems/ThemeProvider", () => ({
  useTheme: vi.fn(),
}));

describe("AppearanceChilds", () => {
  let mockSetTheme: any;
  let mockSetLanguage: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetTheme = vi.fn();
    mockSetLanguage = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      language: "vi",
      setLanguage: mockSetLanguage,
    });
  });

  test("renders AppearanceChilds correctly", () => {
    render(<AppearanceChilds />);
    expect(screen.getByText("Tuỳ chỉnh giao diện")).toBeInTheDocument();
    expect(screen.getByText("Ngôn ngữ")).toBeInTheDocument();
  });

  test("can change language", () => {
    render(<AppearanceChilds />);
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.click(selectTrigger);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]); // Click 'en'
    expect(mockSetLanguage).toHaveBeenCalledWith("en");
  });

  test("can change theme to light, dark, and system", () => {
    render(<AppearanceChilds />);
    fireEvent.click(screen.getByText("Sáng"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");

    fireEvent.click(screen.getByText("Tối"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");

    fireEvent.click(screen.getByText("Hệ thống"));
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});
