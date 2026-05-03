import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { usePayrollsQuery, useHoursQuery } from "@/hooks/queries/usePayrollQueries";
import { useIsMobile } from "@/hooks/use-mobile";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/queries/usePayrollQueries", () => ({
  usePayrollsQuery: vi.fn(),
  useHoursQuery: vi.fn(),
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: vi.fn(),
}));

// Mock recharts
vi.mock("recharts", async () => {
  const OriginalRecharts = await vi.importActual<any>("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children, data }: any) => <div data-testid="bar-chart" data-length={data?.length}>{children}</div>,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
  };
});

describe("ChartAreaInteractive", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useIsMobile as any).mockReturnValue(false);
    
    // Provide some default dummy data to avoid crash
    (usePayrollsQuery as any).mockReturnValue({
      data: {
        data: [
          { TongLuong: 10000000, ThangLuong: "2023-10-01" },
          { TongLuong: 15000000, ThangLuong: "2023-11-01" },
        ]
      }
    });
    
    (useHoursQuery as any).mockReturnValue({
      data: {
        data: [
          { SoGioLam: 160, Thang: "2023-10-01" },
          { SoGioLam: 180, Thang: "2023-11-01" },
        ]
      }
    });
  });

  test("renders salary chart by default", () => {
    render(<ChartAreaInteractive />);
    
    expect(screen.getByText("Quỹ Lương Theo Tháng")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  test("can toggle between salary and hours mode", () => {
    render(<ChartAreaInteractive />);
    
    const salaryTab = screen.getByText("Lương");
    const hoursTab = screen.getByText("Giờ làm");
    
    // Default is salary
    expect(screen.getByText("Quỹ Lương Theo Tháng")).toBeInTheDocument();
    
    // Switch to hours
    fireEvent.click(hoursTab);
    expect(screen.getByText("Giờ Làm Theo Tháng")).toBeInTheDocument();
    
    // Switch back to salary
    fireEvent.click(salaryTab);
    expect(screen.getByText("Quỹ Lương Theo Tháng")).toBeInTheDocument();
  });

  test("handles empty data by falling back to placeholders", () => {
    (usePayrollsQuery as any).mockReturnValue({ data: { data: [] } });
    (useHoursQuery as any).mockReturnValue({ data: { data: [] } });
    
    render(<ChartAreaInteractive />);
    
    expect(screen.getByText("Dữ liệu minh họa — chưa có bảng lương")).toBeInTheDocument();
  });

  test("handles mobile view properly", () => {
    (useIsMobile as any).mockReturnValue(true);
    
    render(<ChartAreaInteractive />);
    
    // In mobile view, range should default to 3m
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-length", "3");
  });
});
