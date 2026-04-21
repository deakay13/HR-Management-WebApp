/* eslint-disable react-refresh/only-export-components */
import type { BaseSalary } from "@/types/payRollTypes/baseSalaryTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { BaseSalaryActionCell } from "@/components/actionCells/workspace/BaseSalaryActionCell";
import { useTranslation } from "react-i18next";

function HeaderMaLCB() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Mã Lương Cơ Bản")}</div>;
}

function HeaderLuongCB() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Lương Cơ Bản")}</div>;
}

function CellLuongCB({ amount }: { amount: number }) {
  const { t } = useTranslation();
  return (
    <div className="w-30 text-center h-8">
      {t("{{count}} VND", { count: amount.toLocaleString("vi-VN") })}
    </div>
  );
}

export const columns: ColumnDef<BaseSalary>[] = [
  {
    accessorKey: "MaLCB",
    header: () => <HeaderMaLCB />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaLCB}</div>
    ),
  },
  {
    accessorKey: "LuongCB",
    header: () => <HeaderLuongCB />,
    cell: ({ row }) => <CellLuongCB amount={Number(row.original.LuongCB || 0)} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <BaseSalaryActionCell baseSalary={row.original} />,
  },
];
