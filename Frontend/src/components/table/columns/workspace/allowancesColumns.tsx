/* eslint-disable react-refresh/only-export-components */
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { AllowanceActionCell } from "@/components/actionCells/workspace/AllowanceActionCell";
import { useTranslation } from "react-i18next";

function HeaderMaPC() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Mã Phụ Cấp")}</div>;
}

function HeaderLoaiPC() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Loại Phụ Cấp")}</div>;
}

function HeaderSoTien() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Số Tiền")}</div>;
}

export const columns: ColumnDef<Allowance>[] = [
  {
    accessorKey: "MaPC",
    header: () => <HeaderMaPC />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaPC}</div>
    ),
  },
  {
    accessorKey: "LoaiPC",
    header: () => <HeaderLoaiPC />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.LoaiPC}</div>
    ),
  },
  {
    accessorKey: "SoTien",
    header: () => <HeaderSoTien />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">
        {row.original.SoTien.toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <AllowanceActionCell allowance={row.original} />,
  },
];
