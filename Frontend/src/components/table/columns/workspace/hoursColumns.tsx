/* eslint-disable react-refresh/only-export-components */
import type { Hours } from "@/types/payRollTypes/hoursTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { HoursActionCell } from "@/components/actionCells/workspace/HoursActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

function CellSoGioLam({ count }: { count: number }) {
  const { t } = useTranslation();
  return <>{t("{{count}} giờ/ngày", { count })}</>;
}

function CellSoNgayLam({ count }: { count: number }) {
  const { t } = useTranslation();
  return <>{t("{{count}} ngày", { count })}</>;
}

function CellTongSoGio({ count }: { count: number }) {
  const { t } = useTranslation();
  return <>{t("{{count}} giờ/tháng", { count })}</>;
}

export const columns: ColumnDef<Hours>[] = [
  {
    accessorKey: "MaGL",
    header: () => <H k="Mã Giờ Làm" />,
    cell: ({ row }) => <>{row.original.MaGL}</>,
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "SoGioLam",
    header: () => <H k="Số Giờ/Ngày" />,
    cell: ({ row }) => <CellSoGioLam count={row.original.SoGioLam} />,
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "SoNgayLam",
    header: () => <H k="Số Ngày Công Chuẩn" />,
    cell: ({ row }) => <CellSoNgayLam count={row.original.SoNgayLam} />,
    size: 180,
    minSize: 180,
  },
  {
    accessorKey: "TongSoGio",
    header: () => <H k="Tổng Giờ Chuẩn" />,
    cell: ({ row }) => <CellTongSoGio count={row.original.TongSoGio} />,
    size: 180,
    minSize: 180,
  },
  {
    id: "actions",
    cell: ({ row }) => <HoursActionCell hours={row.original} />,
    size: 100,
    minSize: 100,
  },
];
