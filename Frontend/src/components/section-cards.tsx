import {
  IconBuildingSkyscraper,
  IconFileText,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconWallet,
  IconActivity,
  IconMinus,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { useContractStore } from "@/stores/informationStores/contractStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { usePayRollStore } from "@/stores/payRollStores/payRollStore";

// Format currency in VND
function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)} tr`;
  }
  return new Intl.NumberFormat("vi-VN").format(amount);
}

export function SectionCards() {
  const { t } = useTranslation();
  const { employees } = useEmployeeStore();
  const { contracts } = useContractStore();
  const { departments } = useDepartmentStore();
  const { PayRolls } = usePayRollStore();

  // KPI calculations
  const totalEmployees = employees.length;
  const activeContracts = contracts.filter((c) => {
    if (!c.NgayKetThuc) return true; // no end date = still active
    return new Date(c.NgayKetThuc) >= new Date();
  }).length;
  const totalDepartments = departments.length;
  const totalPayroll = PayRolls.reduce(
    (sum, p) => sum + (Number(p.TongLuong) || 0),
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
      .map((c) => c.MaNV)
  );
  const activeEmployeesCount = activeEmployeeIds.size;
  const inactiveEmployeesCount = Math.max(0, totalEmployees - activeEmployeesCount);

  // Department Status Calculation
  const activeDepartmentIds = new Set(
    contracts
      .filter((c) => {
        if (!c.NgayKetThuc) return true;
        return new Date(c.NgayKetThuc) >= new Date();
      })
      .map((c) => employees.find((e) => e.MaNV === c.MaNV)?.MaPB)
      .filter(Boolean)
  );
  const activeDepartmentsCount = activeDepartmentIds.size;
  const inactiveDepartmentsCount = Math.max(0, totalDepartments - activeDepartmentsCount);

  // Payroll Trends
  const firstHalf = PayRolls.slice(0, half).reduce(
    (s, p) => s + (Number(p.TongLuong) || 0),
    0,
  );
  const secondHalf = PayRolls.slice(half).reduce(
    (s, p) => s + (Number(p.TongLuong) || 0),
    0,
  );
  const payrollTrend =
    firstHalf > 0
      ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
      : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Total Employees */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-col-name font-semibold">
            <IconUsers className="size-4 text-primary" />
            Tổng Nhân Viên
          </CardDescription>
          <CardTitle className="text-2xl font-mono text-col-data font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEmployees.toLocaleString("vi-VN")}
          </CardTitle>
          <CardAction className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="bg-insight-success-bg text-insight-success-text hover:bg-emerald-500 hover:text-white border-transparent transition-colors">
              <IconActivity className="mr-1 size-4" />
              {activeEmployeesCount} {t("Đang làm việc")}
            </Badge>
            {inactiveEmployeesCount > 0 && (
              <Badge variant="outline" className="bg-insight-danger-bg text-insight-danger-text hover:bg-red-500 hover:text-white border-transparent transition-colors">
                <IconMinus className="mr-1 size-4" />
                {inactiveEmployeesCount} {t("Đã nghỉ/Ngưng")}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-col-data">
            {t("Nhân sự hiện tại")} <IconUsers className="size-4" />
          </div>
          <div className="text-col-date">
            {t("Tổng số nhân viên trong hệ thống")}
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Active Contracts */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-col-name font-semibold">
            <IconFileText className="size-4 text-primary" />
            {t("Hợp Đồng Hiệu Lực")}
          </CardDescription>
          <CardTitle className="text-2xl font-mono text-col-data font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeContracts.toLocaleString("vi-VN")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-insight-success-bg text-insight-success-text hover:bg-emerald-500 hover:text-white border-transparent transition-colors">
              <IconTrendingUp className="mr-1 size-4" />
              {contracts.length > 0
                ? `${Math.round((activeContracts / contracts.length) * 100)}%`
                : "0%"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-col-data">
            {t("Hợp đồng đang có hiệu lực")}
          </div>
          <div className="text-col-date">
            {t("Trên tổng")} {contracts.length} {t("hợp đồng")}
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Departments */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-col-name font-semibold">
            <IconBuildingSkyscraper className="size-4 text-primary" />
            {t("Phòng Ban")}
          </CardDescription>
          <CardTitle className="text-2xl font-mono text-col-data font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalDepartments.toLocaleString("vi-VN")}
          </CardTitle>
          <CardAction className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="bg-insight-success-bg text-insight-success-text hover:bg-emerald-500 hover:text-white border-transparent transition-colors">
              <IconActivity className="mr-1 size-4" />
              {activeDepartmentsCount} {t("Hoạt động")}
            </Badge>
            {inactiveDepartmentsCount > 0 && (
              <Badge variant="outline" className="bg-insight-danger-bg text-insight-danger-text hover:bg-red-500 hover:text-white border-transparent transition-colors">
                <IconMinus className="mr-1 size-4" />
                {inactiveDepartmentsCount} {t("Ngưng hoạt động")}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-col-data">
            {t("Cơ cấu tổ chức")} <IconBuildingSkyscraper className="size-4" />
          </div>
          <div className="text-col-date">{t("Tổng số phòng ban hiện có")}</div>
        </CardFooter>
      </Card>

      {/* Card 4: Total Payroll */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-col-name font-semibold">
            <IconWallet className="size-4 text-primary" />
            {t("Tổng Quỹ Lương")}
          </CardDescription>
          <CardTitle className="text-2xl font-mono text-col-data font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatVND(totalPayroll)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={cn(
              "border-transparent transition-colors",
              payrollTrend > 0
                ? "bg-insight-success-bg text-insight-success-text hover:bg-emerald-500 hover:text-white"
                : payrollTrend < 0
                  ? "bg-insight-danger-bg text-insight-danger-text hover:bg-red-500 hover:text-white"
                  : "bg-insight-neutral-bg text-insight-neutral-text hover:bg-gray-500 hover:text-white"
            )}>
              {payrollTrend > 0 ? (
                <IconTrendingUp className="mr-1 size-4" />
              ) : payrollTrend < 0 ? (
                <IconTrendingDown className="mr-1 size-4" />
              ) : (
                <IconMinus className="mr-1 size-4" />
              )}
              {payrollTrend > 0 ? "+" : ""}
              {payrollTrend}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-col-data">
            {payrollTrend > 0 ? t("Tăng so với kỳ trước") : payrollTrend < 0 ? t("Giảm so với kỳ trước") : t("Ổn định so với kỳ trước")}
            {payrollTrend > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : payrollTrend < 0 ? (
              <IconTrendingDown className="size-4" />
            ) : (
              <IconMinus className="size-4" />
            )}
          </div>
          <div className="text-col-date">
            {t("Tổng lương từ")} {PayRolls.length} {t("bảng lương")}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
