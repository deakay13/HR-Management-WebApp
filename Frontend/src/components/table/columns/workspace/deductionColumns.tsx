/* eslint-disable react-refresh/only-export-components */
import type { Deduction } from "@/types/payRollTypes/deductionTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { DeductionActionCell } from "@/components/actionCells/workspace/DeductionActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const columns: ColumnDef<Deduction>[] = [
  {
    accessorKey: "MaKT",
    header: () => <H k="Mã Khấu Trừ" />,
    cell: ({ row }) => <>{row.original.MaKT}</>,
    size: 200,
    minSize: 200,
  },
  {
    accessorKey: "LoaiKT",
    header: () => <H k="Loại Khấu Trừ" />,
    cell: ({ row }) => <>{row.original.LoaiKT}</>,
    size: 250,
    minSize: 250,
  },
  {
    accessorKey: "PhanTram",
    header: () => <H k="Phần Trăm" />,
    cell: ({ row }) => <>{row.original.PhanTram}%</>,
    size: 150,
    minSize: 150,
  },
  {
    id: "actions",
    cell: ({ row }) => <DeductionActionCell deduction={row.original} />,
    size: 100,
    minSize: 100,
  },
];
