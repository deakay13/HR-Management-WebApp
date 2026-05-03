import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ForbiddenPage from "@/components/auth/ForbiddenPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ForbiddenPage", () => {
  test("renders forbidden page correctly", () => {
    render(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>
    );

    expect(screen.getByText("403 Forbidden")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "403 Lỗi Phân Quyền" })).toBeInTheDocument();
    
    const link = screen.getByRole("link", { name: /Về Trang Chủ/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/PortalPage/DashBoard");
  });
});
