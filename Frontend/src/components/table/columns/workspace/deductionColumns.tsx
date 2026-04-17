/* eslint-disable react-refresh/only-export-components */
import type { Deduction } from "@/types/payRollTypes/deductionTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { DeductionActionCell } from "@/components/actionCells/workspace/DeductionActionCell";
import { useTranslation } from "react-i18next";

function HeaderMaKT() {
  const { t } = useTranslation();
  return <div className="w-20 text-center">{t("Mã Khấu Trừ")}</div>;
}

function HeaderLoaiKT() {
  const { t } = useTranslation();
  return <div className="w-20 text-center">{t("Loại Khấu Trừ")}</div>;
}

function HeaderPhanTram() {
  const { t } = useTranslation();
  return <div className="w-20 text-center">{t("Phần Trăm")}</div>;
}

export const columns: ColumnDef<Deduction>[] = [
  {
    accessorKey: "MaKT",
    header: () => <HeaderMaKT />,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaKT}</div>
    ),
  },
  {
    accessorKey: "LoaiKT",
    header: () => <HeaderLoaiKT />,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.LoaiKT}</div>
    ),
  },
  {
    accessorKey: "PhanTram",
    header: () => <HeaderPhanTram />,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.PhanTram}%</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DeductionActionCell deduction={row.original} />,
  },
];
