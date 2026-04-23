/* eslint-disable react-refresh/only-export-components */
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { AllowanceActionCell } from "@/components/actionCells/workspace/AllowanceActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

function CellSoTien({ amount }: { amount: number }) {
  const { t } = useTranslation();
  return <>{t("{{count}} VND", { count: amount.toLocaleString("vi-VN") })}</>;
}

export const columns: ColumnDef<Allowance>[] = [
  {
    accessorKey: "MaPC",
    header: () => <H k="Mã Phụ Cấp" />,
    cell: ({ row }) => <>{row.original.MaPC}</>,
  },
  {
    accessorKey: "LoaiPC",
    header: () => <H k="Loại Phụ Cấp" />,
    cell: ({ row }) => <>{row.original.LoaiPC}</>,
  },
  {
    accessorKey: "SoTien",
    header: () => <H k="Số Tiền" />,
    cell: ({ row }) => <CellSoTien amount={Number(row.original.SoTien || 0)} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <AllowanceActionCell allowance={row.original} />,
  },
];
