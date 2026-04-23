/* eslint-disable react-refresh/only-export-components */
import type { BaseSalary } from "@/types/payRollTypes/baseSalaryTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { BaseSalaryActionCell } from "@/components/actionCells/workspace/BaseSalaryActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

function CellLuongCB({ amount }: { amount: number }) {
  const { t } = useTranslation();
  return <>{t("{{count}} VND", { count: amount.toLocaleString("vi-VN") })}</>;
}

export const columns: ColumnDef<BaseSalary>[] = [
  {
    accessorKey: "MaLCB",
    header: () => <H k="Mã Lương Cơ Bản" />,
    cell: ({ row }) => <>{row.original.MaLCB}</>,
    size: 200,
    minSize: 200,
  },
  {
    accessorKey: "LuongCB",
    header: () => <H k="Lương Cơ Bản" />,
    cell: ({ row }) => <CellLuongCB amount={Number(row.original.LuongCB || 0)} />,
    size: 250,
    minSize: 250,
  },
  {
    id: "actions",
    cell: ({ row }) => <BaseSalaryActionCell baseSalary={row.original} />,
    size: 100,
    minSize: 100,
  },
];
