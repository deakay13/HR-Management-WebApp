import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import NotificationChilds from "@/components/systems/children/NotificationChildren";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("NotificationChilds", () => {
  test("renders NotificationChilds correctly", () => {
    render(<NotificationChilds />);
    expect(screen.getByText("Thông báo")).toBeInTheDocument();
  });
});
