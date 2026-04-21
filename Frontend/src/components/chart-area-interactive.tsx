import * as React from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePayRollStore } from "@/stores/payRollStores/payRollStore";
import { useHoursStore } from "@/stores/payRollStores/hoursStore";

// Chart config
const chartConfig = {
  luong: {
    label: "Tổng Lương",
    color: "hsl(var(--primary))",
  },
  gioLam: {
    label: "Giờ Làm",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const MONTH_LABELS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

// Format VND compact
function fmtVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  return `${(value / 1_000).toFixed(0)}K`;
}

export function ChartAreaInteractive() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [mode, setMode] = React.useState<"salary" | "hours">("salary");
  const [range, setRange] = React.useState("12m");

  // Set range to 3m on mobile
  React.useEffect(() => {
    if (isMobile) setRange("3m");
  }, [isMobile]);

  const { PayRolls } = usePayRollStore();
  const { Hours } = useHoursStore();

  // Build monthly data from PayRolls
  const salaryByMonth = React.useMemo(() => {
    const map: Record<string, number> = {};
    PayRolls.forEach((p) => {
      // Try to parse a month key from Thang/ThangLuong/NgayLap or fallback
      const raw =
        (p as Record<string, unknown>).Thang ||
        (p as Record<string, unknown>).ThangLuong ||
        (p as Record<string, unknown>).NgayLap;
      if (!raw) return;
      const d = new Date(raw as string);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + (Number(p.TongLuong) || 0);
    });
    return map;
  }, [PayRolls]);

  // Build monthly data from Hours
  const hoursByMonth = React.useMemo(() => {
    const map: Record<string, number> = {};
    Hours.forEach((h) => {
      const raw =
        (h as Record<string, unknown>).Thang ||
        (h as Record<string, unknown>).NgayLap ||
        (h as Record<string, unknown>).TuNgay;
      if (!raw) return;
      const d = new Date(raw as string);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] =
        (map[key] || 0) +
        (Number(
          (h as Record<string, unknown>).SoGioLam ||
            (h as Record<string, unknown>).TongGio,
        ) || 0);
    });
    return map;
  }, [Hours]);

  // Anchor to the latest available month in real data (or system date as fallback)
  const anchorDate = React.useMemo(() => {
    const sourceMap = mode === "salary" ? salaryByMonth : hoursByMonth;
    const dates = Object.keys(sourceMap);
    if (dates.length === 0) return new Date();
    const latestKey = [...dates].sort().pop()!;
    const [year, month] = latestKey.split("-").map(Number);
    return new Date(year, month - 1, 1);
  }, [salaryByMonth, hoursByMonth, mode]);

  // Build chart data anchored to the latest available data month
  const chartData = React.useMemo(() => {
    const monthsBack = range === "3m" ? 3 : range === "6m" ? 6 : 12;
    const months: {
      month: string;
      label: string;
      luong: number;
      gioLam: number;
    }[] = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthIdx = d.getMonth();
      const salaryReal = salaryByMonth[key];
      const hoursReal = hoursByMonth[key];

      // Deterministic seed for placeholder when no real data
      const seed = (d.getFullYear() * 12 + d.getMonth()) % 17;
      const baseSalary = 80_000_000 + seed * 5_000_000;
      const baseHours = 160 + seed * 4;

      months.push({
        month: key,
        label: `${MONTH_LABELS[monthIdx]}/${d.getFullYear()}`,
        luong: salaryReal !== undefined ? salaryReal : baseSalary,
        gioLam: hoursReal !== undefined ? hoursReal : baseHours,
      });
    }
    return months;
  }, [range, salaryByMonth, hoursByMonth, anchorDate]);

  const hasRealSalaryData = Object.keys(salaryByMonth).length > 0;
  const hasRealHoursData = Object.keys(hoursByMonth).length > 0;
  const isRealData = mode === "salary" ? hasRealSalaryData : hasRealHoursData;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          {mode === "salary" ? t("Quỹ Lương Theo Tháng") : t("Giờ Làm Theo Tháng")}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {isRealData
              ? t("Dữ liệu thực từ hệ thống")
              : t("Dữ liệu minh họa — chưa có bảng lương")}
          </span>
          <span className="@[540px]/card:hidden">
            {isRealData ? t("Dữ liệu thực") : t("Minh họa")}
          </span>
        </CardDescription>
        <CardAction>
          {/* Mode toggle */}
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as "salary" | "hours")}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-3! @[540px]/card:flex *:data-[state=on]:bg-primary *:data-[state=on]:text-primary-foreground *:data-[state=on]:border-primary">
            <ToggleGroupItem value="salary">{t("Lương")}</ToggleGroupItem>
            <ToggleGroupItem value="hours">{t(t("Giờ làm"))}</ToggleGroupItem>
          </ToggleGroup>

          {/* Range select */}
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger
              className="ml-2 flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Chọn khoảng thời gian">
              <SelectValue placeholder={t("12 tháng")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="3m" className="rounded-lg">
                {t("3 tháng")}
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                {t("6 tháng")}
              </SelectItem>
              <SelectItem value="12m" className="rounded-lg">
                {t("12 tháng")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full">
          <BarChart data={chartData} barSize={range === "12m" ? 28 : 48}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground) / 0.3)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (mode === "salary" ? fmtVND(v) : `${v}h`)}
              width={52}
              stroke="hsl(var(--muted-foreground))"
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--primary))", opacity: 0.06 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const item = payload?.[0]?.payload as { month: string };
                    if (!item?.month) return "";
                    const [y, m] = item.month.split("-");
                    return `${t("Tháng")} ${m}/${y}`;
                  }}
                  formatter={(value, name) => {
                    if (name === "luong")
                      return [
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(Number(value)),
                        t("Tổng lương"),
                      ];
                    return [`${value} giờ`, "Giờ làm"];
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey={mode === "salary" ? "luong" : "gioLam"}
              fill={
                mode === "salary" ? "var(--color-luong)" : "var(--color-gioLam)"
              }
              radius={[4, 4, 0, 0]}
              opacity={0.9}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
