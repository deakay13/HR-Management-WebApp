/* eslint-disable react-refresh/only-export-components */
import type { Hours } from "@/types/payRollTypes/hoursTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { HoursActionCell } from "@/components/actionCells/workspace/HoursActionCell";
import { useTranslation } from "react-i18next";

function HeaderMaGL() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Mã Giờ Làm")}</div>;
}

function HeaderSoGioLam() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Số Giờ/Ngày")}</div>;
}

function HeaderSoNgayLam() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Số Ngày Công Chuẩn")}</div>;
}

function HeaderTongSoGio() {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t("Tổng Giờ Chuẩn")}</div>;
}

function CellSoGioLam({ count }: { count: number }) {
  const { t } = useTranslation();
  return <div className="w-30 text-center h-8">{t("{{count}} giờ/ngày", { count })}</div>;
}

function CellSoNgayLam({ count }: { count: number }) {
  const { t } = useTranslation();
  return <div className="w-30 text-center h-8">{t("{{count}} ngày", { count })}</div>;
}

function CellTongSoGio({ count }: { count: number }) {
  const { t } = useTranslation();
  return <div className="w-30 text-center h-8 font-semibold">{t("{{count}} giờ/tháng", { count })}</div>;
}

export const columns: ColumnDef<Hours>[] = [
  {
    accessorKey: "MaGL",
    header: () => <HeaderMaGL />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaGL}</div>
    ),
  },
  {
    accessorKey: "SoGioLam",
    header: () => <HeaderSoGioLam />,
    cell: ({ row }) => <CellSoGioLam count={row.original.SoGioLam} />,
  },
  {
    accessorKey: "SoNgayLam",
    header: () => <HeaderSoNgayLam />,
    cell: ({ row }) => <CellSoNgayLam count={row.original.SoNgayLam} />,
  },
  {
    accessorKey: "TongSoGio",
    header: () => <HeaderTongSoGio />,
    cell: ({ row }) => <CellTongSoGio count={row.original.TongSoGio} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <HoursActionCell hours={row.original} />,
  },
];
