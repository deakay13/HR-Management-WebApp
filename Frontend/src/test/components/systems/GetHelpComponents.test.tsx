import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import GetHelpComponents from "@/components/systems/GetHelpComponents";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ 
    t: (key: string) => key,
    i18n: { language: "vi" }
  }),
}));

vi.mock("@/components/systems/ThemeProvider", () => ({
  useTheme: () => ({ language: "vi" }),
}));

describe("GetHelpComponents", () => {
  test("renders GetHelpComponents correctly", () => {
    render(<GetHelpComponents />);
    
    expect(screen.getByText("Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Nhân Sự Nội Bộ")).toBeInTheDocument();
    expect(screen.getByText("1. Quản Lý Thông Tin Nhân Viên")).toBeInTheDocument();
    expect(screen.getByText("Báo Cáo Lỗi")).toBeInTheDocument();
  });
});
