import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import DisplayChilds from "@/components/systems/children/DisplayChildren";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("DisplayChilds", () => {
  test("renders DisplayChilds correctly", () => {
    render(<DisplayChilds />);
    expect(screen.getByText("Thanh bên")).toBeInTheDocument();
    expect(screen.getByText("Hợp Đồng")).toBeInTheDocument();
  });

  test("can toggle items", () => {
    render(<DisplayChilds />);
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Toggle off
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
