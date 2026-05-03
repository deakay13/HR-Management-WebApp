import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import SettingsComponents from "@/components/systems/SettingsComponents";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/systems/children/AppearanceChildren", () => ({
  default: () => <div data-testid="appearance-child">AppearanceChilds</div>,
}));

vi.mock("@/components/systems/children/DisplayChildren", () => ({
  default: () => <div data-testid="display-child">DisplayChilds</div>,
}));

vi.mock("@/components/systems/children/NotificationChildren", () => ({
  default: () => <div data-testid="notification-child">NotificationChilds</div>,
}));

describe("SettingsComponents", () => {
  test("renders SettingsComponents and switches tabs correctly", () => {
    render(<SettingsComponents />);
    
    expect(screen.getByText("Cài đặt")).toBeInTheDocument();
    
    // Default tab is Appearance
    expect(screen.getByTestId("appearance-child")).toBeInTheDocument();
    
    // Switch to Notification
    fireEvent.click(screen.getByText("Thông báo"));
    expect(screen.getByTestId("notification-child")).toBeInTheDocument();
    
    // Switch to Display
    fireEvent.click(screen.getByText("Màn hình"));
    expect(screen.getByTestId("display-child")).toBeInTheDocument();
  });
});
