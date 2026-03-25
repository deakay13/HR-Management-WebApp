import type { Account } from "@/types/authTypes/accountType";
import { type ColumnDef } from "@tanstack/react-table";
import { AccountsActionCell } from "@/components/ActionComponets/Managements/AccountsActionCell";

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "MaTK",
    header: () => <div className="w-30 text-center">Mã Tài Khoản</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaTK}</div>
    ),
  },
  {
    accessorKey: "MaNV",
    header: () => <div className="w-30 text-center">Mã Nhân Viên</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaNV}</div>
    ),
  },
  {
    accessorKey: "MaVT",
    header: () => <div className="w-30 text-center">Mã Vai Trò</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaVT}</div>
    ),
  },
  {
    accessorKey: "TenTaiKhoan",
    header: () => <div className="w-30 text-center">Tên Tài Khoản</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.TenTaiKhoan}</div>
    ),
  },
  {
    accessorKey: "MatKhau",
    header: () => <div className="w-full text-center">Mật khẩu</div>,
    cell: ({ row }) => <div className="w-full">{row.original.MatKhau}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="w-full text-center">Ngày Tạo</div>,
    cell: ({ row }) => <div className="w-full">{row.original.createdAt}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="w-full text-center">Ngày Cập Nhật</div>,
    cell: ({ row }) => <div className="w-full">{row.original.updatedAt}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <AccountsActionCell acc={row.original} />,
  },
];
