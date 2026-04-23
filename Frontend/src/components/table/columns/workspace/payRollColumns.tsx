/* eslint-disable react-refresh/only-export-components */
import type { PayRoll } from "@/types/payRollTypes/payRollTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { PayRollActionCell } from "@/components/actionCells/workspace/PayRollActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

function CellTongGioCong({
  dailyHours,
  days,
}: {
  dailyHours: number;
  days: number;
}) {
  const { t } = useTranslation();
  return <>{t("{{count}} giờ", { count: dailyHours * days })}</>;
}

function CellLuongCB({ amount, code }: { amount: number; code: string }) {
  const { t } = useTranslation();
  return (
    <>
      {t("{{count}} VND", { count: amount.toLocaleString("vi-VN") })} ({code})
    </>
  );
}

function CellTongLuong({ amount }: { amount: number }) {
  const { t } = useTranslation();
  return (
    <span className="font-medium">
      {t("{{count}} VND", { count: amount.toLocaleString("vi-VN") })}
    </span>
  );
}

export const columns: ColumnDef<PayRoll>[] = [
  {
    accessorKey: "MaBL",
    header: () => <H k="Mã Bảng Lương" />,
    cell: ({ row }) => <>{row.original.MaBL}</>,
  },
  {
    accessorKey: "MaNV",
    header: () => <H k="Mã Nhân Viên" />,
    cell: ({ row }) => <>{row.original.MaNV}</>,
  },
  {
    id: "HoVaTen",
    header: () => <H k="Họ và Tên" />,
    accessorFn: (row) => row.NhanVien?.HoVaTen,
    cell: ({ row }) => <>{row.original.NhanVien?.HoVaTen || "N/A"}</>,
  },
  {
    accessorKey: "MaKT",
    header: () => <H k="Mã Khấu Trừ" />,
    cell: ({ row }) => (
      <>
        {row.original.KhauTru
          ? `${row.original.KhauTru.LoaiKT} (${row.original.MaKT})`
          : row.original.MaKT}
      </>
    ),
  },
  {
    accessorKey: "MaPC",
    header: () => <H k="Mã Phụ Cấp" />,
    cell: ({ row }) => (
      <>
        {row.original.PhuCapThuong
          ? `${row.original.PhuCapThuong.LoaiPC} (${row.original.MaPC})`
          : row.original.MaPC}
      </>
    ),
  },
  {
    id: "TongGioCong",
    header: () => <H k="Tổng Giờ Công" />,
    cell: ({ row }) => (
      <CellTongGioCong
        dailyHours={Number(row.original.TongGioLam?.SoGioLam || 0)}
        days={Number(row.original.SoNgayLam || 0)}
      />
    ),
  },
  {
    accessorKey: "MaLCB",
    header: () => <H k="Mã Lương Cơ Bản" />,
    cell: ({ row }) => (
      <CellLuongCB
        amount={Number(row.original.LuongCoBan?.LuongCB || 0)}
        code={row.original.MaLCB}
      />
    ),
  },
  {
    accessorKey: "Thang",
    header: () => <H k="Tháng Trong Năm" />,
    cell: ({ row }) => <>{row.original.Thang}</>,
  },
  {
    accessorKey: "NgayTinhLuong",
    header: () => <H k="Ngày Tính Lương" />,
    cell: ({ row }) => <>{row.original.NgayTinhLuong}</>,
  },
  {
    accessorKey: "TongLuong",
    header: () => <H k="Tổng Lương" />,
    cell: ({ row }) => (
      <CellTongLuong amount={Number(row.original.TongLuong || 0)} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <PayRollActionCell payRoll={row.original} />,
  },
];
