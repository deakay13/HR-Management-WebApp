import {
  IconBuildingSkyscraper,
  IconFileText,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconWallet,
  IconActivity,
  IconMinus,
  IconUserCheck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";
import { useContractsQuery } from "@/hooks/queries/useContractsQuery";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";
import { usePayrollsQuery } from "@/hooks/queries/usePayrollQueries";

// Format currency in VND
// Format currency in VND perfectly
function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (
      (amount / 1_000_000_000).toLocaleString("vi-VN", {
        maximumSignificantDigits: 4,
      }) + " Tỷ"
    );
  }
  if (amount >= 1_000_000) {
    return (
      (amount / 1_000_000).toLocaleString("vi-VN", {
        maximumSignificantDigits: 4,
      }) + " Triệu"
    );
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function SectionCards() {
  const { t } = useTranslation();
  const { data: employeesData } = useEmployeesQuery({ page: 1, limit: 10000 });
  const { data: contractsData } = useContractsQuery({ page: 1, limit: 10000 });
  const { data: departmentsData } = useDepartmentsQuery({ page: 1, limit: 10000 });
  const { data: payRollsData } = usePayrollsQuery({ page: 1, limit: 10000 });
  const { accounts } = useAccountsStore();

  const employees = employeesData?.data || [];
  const contracts = contractsData?.data || [];
  const departments = departmentsData?.data || [];
  const PayRolls = payRollsData?.data || [];

  // KPI calculations
  const totalEmployees = employees.length;
  const activeContracts = contracts.filter((c) => {
    if (!c.NgayKetThuc) return true; // no end date = still active
    return new Date(c.NgayKetThuc) >= new Date();
  }).length;
  const totalDepartments = departments.length;
  const totalPayroll = PayRolls.reduce(
    (sum: number, p: Record<string, unknown>) => sum + (Number(p.TongLuong) || 0),
    0,
  );

  // Simple trend: compare first half vs second half of payroll list
  const half = Math.floor(PayRolls.length / 2);
  // Employee Status Calculation
  const activeEmployeeIds = new Set(
    contracts
      .filter((c) => {
        if (!c.NgayKetThuc) return true;
        return new Date(c.NgayKetThuc) >= new Date();
      })
      .map((c) => c.MaNV),
  );
  const activeEmployeesCount = activeEmployeeIds.size;
  const inactiveEmployeesCount = Math.max(
    0,
    totalEmployees - activeEmployeesCount,
  );

  // Department Status Calculation
  const activeDepartmentIds = new Set(
    contracts
      .filter((c) => {
        if (!c.NgayKetThuc) return true;
        return new Date(c.NgayKetThuc) >= new Date();
      })
      .map((c) => employees.find((e) => e.MaNV === c.MaNV)?.MaPB)
      .filter(Boolean),
  );
  const activeDepartmentsCount = activeDepartmentIds.size;
  const inactiveDepartmentsCount = Math.max(
    0,
    totalDepartments - activeDepartmentsCount,
  );

  // Payroll Trends
  const firstHalf = PayRolls.slice(0, half).reduce(
    (s: number, p: Record<string, unknown>) => s + (Number(p.TongLuong) || 0),
    0,
  );
  const secondHalf = PayRolls.slice(half).reduce(
    (s: number, p: Record<string, unknown>) => s + (Number(p.TongLuong) || 0),
    0,
  );
  const payrollTrend =
    firstHalf > 0
      ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
      : 0;

  // Accounts Calculation
  const totalAccounts = accounts.length;
  const onlineAccounts = accounts.filter(
    (a) => a.TrangThai === "Online",
  ).length;
  const offlineAccounts = accounts.filter(
    (a) => a.TrangThai !== "Online",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-4 px-4 lg:px-6 lg:grid-cols-3 @5xl/main:grid-cols-5">
      {/* Card 1: Total Employees */}
      <Card
        style={{ backgroundColor: "#7DA0FA" }}
        className="@container/card flex flex-col text-white border-transparent overflow-hidden h-full min-h-[180px]"
      >
        <CardHeader className="pb-0 pt-4 px-4 flex-none min-h-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-2.5 w-full min-w-0">
            <CardDescription className="flex items-center gap-1.5 text-white/90 font-semibold mb-0 shrink-0 min-w-0 max-w-full">
              <IconUsers className="size-4 text-white shrink-0" />
              <span className="truncate">{t("Tổng Nhân Viên")}</span>
            </CardDescription>
            <div className="flex flex-wrap items-center gap-1.5 shrink min-w-0 w-full @[250px]/card:w-auto @[250px]/card:justify-end">
              <div className="group relative flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="bg-insight-success-bg text-insight-success-text hover:bg-insight-success-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                >
                  <IconActivity className="mr-1 size-3.5 shrink-0" />
                  <span className="truncate font-bold">
                    {activeEmployeesCount}
                  </span>
                </Badge>
                <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-success-bg text-insight-success-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-success-text/20">
                  {t("Đang làm việc")}
                </div>
              </div>
              {inactiveEmployeesCount > 0 && (
                <div className="group relative flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="bg-insight-danger-bg text-insight-danger-text hover:bg-insight-danger-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                  >
                    <IconMinus className="mr-1 size-3.5 shrink-0" />
                    <span className="truncate font-bold">
                      {inactiveEmployeesCount}
                    </span>
                  </Badge>
                  <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-danger-bg text-insight-danger-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-danger-text/20">
                    {t("Đã nghỉ")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 w-full">
          <div
            className="text-4xl @[250px]/card:text-5xl font-mono text-white font-extrabold tabular-nums truncate w-full text-center drop-shadow-sm"
            title={totalEmployees.toLocaleString("vi-VN")}
          >
            {totalEmployees.toLocaleString("vi-VN")}
          </div>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-2 mt-auto border-t border-white/20 pt-3 pb-4 px-4 flex-none min-h-[48px] min-w-0">
          <div className="flex items-center gap-2 font-medium text-sm text-white/95 truncate shrink min-w-0">
            <span className="truncate">{t("Nhân sự hiện tại")}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Active Contracts */}
      <Card
        style={{ backgroundColor: "#7978E9" }}
        className="@container/card flex flex-col text-white border-transparent overflow-hidden h-full min-h-[180px]"
      >
        <CardHeader className="pb-0 pt-4 px-4 flex-none min-h-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-2.5 w-full min-w-0">
            <CardDescription className="flex items-center gap-1.5 text-white/90 font-semibold mb-0 shrink-0 min-w-0 max-w-full">
              <IconFileText className="size-4 text-white shrink-0" />
              <span className="truncate">{t("Hợp Đồng")}</span>
            </CardDescription>
            <div className="flex flex-wrap items-center gap-1.5 shrink min-w-0 w-full @[250px]/card:w-auto @[250px]/card:justify-end">
              <div className="group relative flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="bg-insight-success-bg text-insight-success-text hover:bg-insight-success-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                >
                  <IconTrendingUp className="mr-1 size-3.5 shrink-0" />
                  <span className="truncate font-bold">
                    {contracts.length > 0
                      ? `${Math.round((activeContracts / contracts.length) * 100)}%`
                      : "0%"}
                  </span>
                </Badge>
                <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-success-bg text-insight-success-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-success-text/20">
                  {t("Có hiệu lực")}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 w-full">
          <div
            className="text-4xl @[250px]/card:text-5xl font-mono text-white font-extrabold tabular-nums truncate w-full text-center drop-shadow-sm"
            title={activeContracts.toLocaleString("vi-VN")}
          >
            {activeContracts.toLocaleString("vi-VN")}
          </div>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-2 mt-auto border-t border-white/20 pt-3 pb-4 px-4 flex-none min-h-[48px] min-w-0">
          <div className="flex items-center gap-2 font-medium text-sm text-white/95 truncate shrink min-w-0">
            <span className="truncate">{t("Hiệu lực")}</span>
          </div>
          <div className="truncate text-sm text-right ml-2 shrink min-w-0 text-white/80">
            {t("Trên tổng")} {contracts.length}
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Departments */}
      <Card
        style={{ backgroundColor: "#6261CB" }}
        className="@container/card flex flex-col text-white border-transparent overflow-hidden h-full min-h-[180px]"
      >
        <CardHeader className="pb-0 pt-4 px-4 flex-none min-h-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-2.5 w-full min-w-0">
            <CardDescription className="flex items-center gap-1.5 text-white/90 font-semibold mb-0 shrink-0 min-w-0 max-w-full">
              <IconBuildingSkyscraper className="size-4 text-white shrink-0" />
              <span className="truncate">{t("Phòng Ban")}</span>
            </CardDescription>
            <div className="flex flex-wrap items-center gap-1.5 shrink min-w-0 w-full @[250px]/card:w-auto @[250px]/card:justify-end">
              <div className="group relative flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="bg-insight-success-bg text-insight-success-text hover:bg-insight-success-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                >
                  <IconActivity className="mr-1 size-3.5 shrink-0" />
                  <span className="truncate font-bold">
                    {activeDepartmentsCount}
                  </span>
                </Badge>
                <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-success-bg text-insight-success-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-success-text/20">
                  {t("Hoạt động")}
                </div>
              </div>
              {inactiveDepartmentsCount > 0 && (
                <div className="group relative flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="bg-insight-danger-bg text-insight-danger-text hover:bg-insight-danger-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                  >
                    <IconMinus className="mr-1 size-3.5 shrink-0" />
                    <span className="truncate font-bold">
                      {inactiveDepartmentsCount}
                    </span>
                  </Badge>
                  <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-danger-bg text-insight-danger-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-danger-text/20">
                    {t("Ngưng")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 w-full">
          <div
            className="text-4xl @[250px]/card:text-5xl font-mono text-white font-extrabold tabular-nums truncate w-full text-center drop-shadow-sm"
            title={totalDepartments.toLocaleString("vi-VN")}
          >
            {totalDepartments.toLocaleString("vi-VN")}
          </div>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-2 mt-auto border-t border-white/20 pt-3 pb-4 px-4 flex-none min-h-[48px] min-w-0">
          <div className="flex items-center gap-2 font-medium text-sm text-white/95 truncate shrink min-w-0">
            <span className="truncate">{t("Cơ cấu tổ chức")}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Total Payroll */}
      <Card
        style={{ backgroundColor: "#4B49AC" }}
        className="@container/card flex flex-col text-white border-transparent overflow-hidden h-full min-h-[180px]"
      >
        <CardHeader className="pb-0 pt-4 px-4 flex-none min-h-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-2.5 w-full min-w-0">
            <CardDescription className="flex items-center gap-1.5 text-white/90 font-semibold mb-0 shrink-0 min-w-0 max-w-full">
              <IconWallet className="size-4 text-white shrink-0" />
              <span className="truncate">{t("Tổng Quỹ Lương")}</span>
            </CardDescription>
            <div className="flex flex-wrap items-center gap-1.5 shrink min-w-0 w-full @[250px]/card:w-auto @[250px]/card:justify-end">
              <div className="group relative flex items-center justify-center">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-transparent transition-colors max-w-full px-2 cursor-pointer",
                    payrollTrend > 0
                      ? "bg-insight-success-bg text-insight-success-text hover:bg-insight-success-bg/90"
                      : payrollTrend < 0
                        ? "bg-insight-danger-bg text-insight-danger-text hover:bg-insight-danger-bg/90"
                        : "bg-insight-neutral-bg text-insight-neutral-text hover:bg-insight-neutral-bg/90",
                  )}
                >
                  {payrollTrend > 0 ? (
                    <IconTrendingUp className="mr-1 size-3.5 shrink-0" />
                  ) : payrollTrend < 0 ? (
                    <IconTrendingDown className="mr-1 size-3.5 shrink-0" />
                  ) : (
                    <IconMinus className="mr-1 size-3.5 shrink-0" />
                  )}
                  <span className="truncate font-bold">
                    {payrollTrend > 0 ? "+" : ""}
                    {payrollTrend}%
                  </span>
                </Badge>
                <div
                  className={cn(
                    "absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap",
                    payrollTrend > 0
                      ? "bg-insight-success-bg text-insight-success-text border border-insight-success-text/20"
                      : payrollTrend < 0
                        ? "bg-insight-danger-bg text-insight-danger-text border border-insight-danger-text/20"
                        : "bg-insight-neutral-bg text-insight-neutral-text border border-insight-neutral-text/20",
                  )}
                >
                  {payrollTrend > 0
                    ? t("Tăng")
                    : payrollTrend < 0
                      ? t("Giảm")
                      : t("Ổn định")}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 w-full">
          {/* Note: Decreased font size mapping here to fit huge currency numbers */}
          <div
            className="text-2xl @[250px]/card:text-3xl @[350px]/card:text-4xl font-mono text-white font-extrabold tabular-nums truncate w-full text-center drop-shadow-sm"
            title={new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPayroll)}
          >
            {formatVND(totalPayroll)}
          </div>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-2 mt-auto border-t border-white/20 pt-3 pb-4 px-4 flex-none min-h-[48px] min-w-0">
          <div className="flex items-center gap-2 font-medium text-sm text-white/95 truncate shrink min-w-0">
            <span className="truncate">
              {payrollTrend > 0
                ? t("Tăng dần")
                : payrollTrend < 0
                  ? t("Giảm dần")
                  : t("Ổn định")}
            </span>
          </div>
          <div className="truncate text-sm text-right ml-2 shrink min-w-0 text-white/80">
            {t("Từ")} {PayRolls.length} {t("bảng lương")}
          </div>
        </CardFooter>
      </Card>

      {/* Card 5: Account Status */}
      <Card
        style={{ backgroundColor: "#6F42C1" }}
        className="@container/card flex flex-col text-white border-transparent overflow-hidden h-full min-h-[180px]"
      >
        <CardHeader className="pb-0 pt-4 px-4 flex-none min-h-[64px]">
          <div className="flex flex-wrap items-start justify-between gap-2.5 w-full min-w-0">
            <CardDescription className="flex items-center gap-1.5 text-white/90 font-semibold mb-0 shrink-0 min-w-0 max-w-full">
              <IconUserCheck className="size-4 text-white shrink-0" />
              <span className="truncate">{t("Tài Khoản")}</span>
            </CardDescription>
            <div className="flex flex-wrap items-center gap-1.5 shrink min-w-0 w-full @[250px]/card:w-auto @[250px]/card:justify-end">
              <div className="group relative flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="bg-insight-success-bg text-insight-success-text hover:bg-insight-success-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                >
                  <IconActivity className="mr-1 size-3.5 shrink-0" />
                  <span className="truncate font-bold">{onlineAccounts}</span>
                </Badge>
                <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-success-bg text-insight-success-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-success-text/20">
                  {t("Online")}
                </div>
              </div>
              {offlineAccounts > 0 && (
                <div className="group relative flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="bg-insight-neutral-bg text-insight-neutral-text hover:bg-insight-neutral-bg/90 border-transparent transition-colors max-w-full px-2 cursor-pointer"
                  >
                    <IconMinus className="mr-1 size-3.5 shrink-0" />
                    <span className="truncate font-bold">
                      {offlineAccounts}
                    </span>
                  </Badge>
                  <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-insight-neutral-bg text-insight-neutral-text rounded-full px-3 py-1 text-xs shadow-md font-bold whitespace-nowrap border border-insight-neutral-text/20">
                    {t("Offline")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 w-full">
          <div
            className="text-4xl @[250px]/card:text-5xl font-mono text-white font-extrabold tabular-nums truncate w-full text-center drop-shadow-sm"
            title={totalAccounts.toLocaleString("vi-VN")}
          >
            {totalAccounts.toLocaleString("vi-VN")}
          </div>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-2 mt-auto border-t border-white/20 pt-3 pb-4 px-4 flex-none min-h-[48px] min-w-0">
          <div className="flex items-center gap-2 font-medium text-sm text-white/95 truncate shrink min-w-0">
            <span className="truncate">{t("Hệ thống")}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
