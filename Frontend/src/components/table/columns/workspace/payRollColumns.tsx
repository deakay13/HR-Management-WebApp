/* eslint-disable react-refresh/only-export-components */
import type { PayRoll } from "@/types/payRollTypes/payRollTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { PayRollActionCell } from "@/components/actionCells/workspace/PayRollActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t(k)}</div>;
}

export const columns: ColumnDef<PayRoll>[] = [
  {
    accessorKey: "MaBL",
    header: () => <H k="Mã Bảng Lương" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaBL}</div>
    ),
  },
  {
    accessorKey: "MaNV",
    header: () => <H k="Mã Nhân Viên" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaNV}</div>
    ),
  },
  {
    id: "HoVaTen",
    header: () => <H k="Họ và Tên" />,
    accessorFn: (row) => row.NhanVien?.HoVaTen,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">
        {row.original.NhanVien?.HoVaTen || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "MaKT",
    header: () => <H k="Mã Khấu Trừ" />,
    cell: ({ row }) => (
      <div className="w-40 text-center h-8">
        {row.original.KhauTru 
          ? `${row.original.KhauTru.LoaiKT} (${row.original.MaKT})` 
          : row.original.MaKT}
      </div>
    ),
  },
  {
    accessorKey: "MaPC",
    header: () => <H k="Mã Phụ Cấp" />,
    cell: ({ row }) => (
      <div className="w-40 text-center h-8">
        {row.original.PhuCapThuong 
          ? `${row.original.PhuCapThuong.LoaiPC} (${row.original.MaPC})` 
          : row.original.MaPC}
      </div>
    ),
  },
  {
    accessorKey: "MaGL",
    header: () => <H k="Mã Giờ Làm" />,
    cell: ({ row }) => (
      <div className="w-40 text-center h-8">
        {row.original.TongGioLam 
          ? `${row.original.TongGioLam.SoGioLam}h (${row.original.MaGL})` 
          : row.original.MaGL}
      </div>
    ),
  },
  {
    accessorKey: "MaLCB",
    header: () => <H k="Mã Lương Cơ Bản" />,
    cell: ({ row }) => (
      <div className="w-40 text-center h-8">
        {row.original.LuongCoBan 
          ? `${Number(row.original.LuongCoBan.LuongCB || 0).toLocaleString()} (${row.original.MaLCB})` 
          : row.original.MaLCB}
      </div>
    ),
  },
  {
    accessorKey: "Thang",
    header: () => <H k="Tháng" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.Thang}</div>
    ),
  },
  {
    accessorKey: "NgayTinhLuong",
    header: () => <H k="Ngày Tính Lương" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.NgayTinhLuong}</div>
    ),
  },
  {
    accessorKey: "TongLuong",
    header: () => <H k="Tổng Lương" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.TongLuong}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <PayRollActionCell payRoll={row.original} />,
  },
];
