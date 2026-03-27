import type { PayRoll } from "@/types/payRollTypes/payRollTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { PayRollActionCell  } from "@/components/ActionComponets/workspace/PayRollActionsCell";

export const columns: ColumnDef<PayRoll>[] = [
  {
    accessorKey: "MaBL",
    header: () => <div className="w-20 text-center">Mã Bảng Lương</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaBL}</div>
    ),
  },
  {
    accessorKey: "MaNV",
    header: () => <div className="w-20 text-center">Mã Nhân Viên</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaNV }</div>
    ),
  },
  {
    accessorKey: "MaKT",
    header: () => <div className="w-20 text-center">Mã Khấu Trừ</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaKT }</div>
    ),
  },
   {
    accessorKey: "MaPC",
    header: () => <div className="w-20 text-center">Mã Phụ Cấp</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaPC }</div>
    ),
  },
   {
    accessorKey: "MaGL",
    header: () => <div className="w-20 text-center">Mã Giờ Làm</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaGL }</div>
    ),
  },
   {
    accessorKey: "MaLCB",
    header: () => <div className="w-20 text-center">Mã Lương Cơ Bản</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaLCB }</div>
    ),
  },
   {
    accessorKey: "Thang",
    header: () => <div className="w-20 text-center">Tháng</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.Thang }</div>
    ),
  },
   {
    accessorKey: "NgayTinhLuong",
    header: () => <div className="w-20 text-center">Ngày Tính Lương</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.NgayTinhLuong }</div>
    ),
  },
   {
    accessorKey: "TongLuong",
    header: () => <div className="w-20 text-center">Tổng Lương</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.TongLuong }</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <PayRollActionCell payRoll={row.original} />,
  },
];
