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
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.SoGioLam}h/ngày</div>
    ),
  },
  {
    accessorKey: "SoNgayLam",
    header: () => <HeaderSoNgayLam />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.SoNgayLam} ngày</div>
    ),
  },
  {
    accessorKey: "TongSoGio",
    header: () => <HeaderTongSoGio />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8 font-semibold">{row.original.TongSoGio}h/tháng</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <HoursActionCell hours={row.original} />,
  },
];
