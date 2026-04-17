/* eslint-disable react-refresh/only-export-components */
import type { Account } from "@/types/authTypes/accountTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { AccountsActionCell } from "@/components/actionCells/managements/AccountsActionCell";
import { useTranslation } from "react-i18next";

function H({ k, className = "w-30 text-center" }: { k: string; className?: string }) {
  const { t } = useTranslation();
  return <div className={className}>{t(k)}</div>;
}

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "MaTK",
    header: () => <H k="Mã Tài Khoản" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaTK}</div>
    ),
  },
  {
    accessorKey: "MaNV",
    header: () => <H k="Mã Nhân Viên" />,
    cell: ({ row }) => (
      <div className="w-40 text-center h-8">
        {row.original.HoVaTen ? `${row.original.HoVaTen} (${row.original.MaNV})` : row.original.MaNV}
      </div>
    ),
  },
  {
    accessorKey: "MaVT",
    header: () => <H k="Mã Vai Trò" />,
    cell: ({ row }) => (
      <div className="w-40 text-center h-8">
        {row.original.TenVaiTro ? `${row.original.TenVaiTro} (${row.original.MaVT})` : row.original.MaVT}
      </div>
    ),
  },
  {
    accessorKey: "TenTaiKhoan",
    header: () => <H k="Tên Tài Khoản" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.TenTaiKhoan}</div>
    ),
  },
  {
    accessorKey: "MatKhau",
    header: () => <H k="Mật Khẩu" className="w-full text-center" />,
    cell: ({ row }) => <div className="w-full">{row.original.MatKhau}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <H k="Ngày Tạo" className="w-full text-center" />,
    cell: ({ row }) => <div className="w-full">{row.original.createdAt}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: () => <H k="Ngày Cập Nhật" className="w-full text-center" />,
    cell: ({ row }) => <div className="w-full">{row.original.updatedAt}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <AccountsActionCell acc={row.original} />,
  },
];
