/* eslint-disable react-refresh/only-export-components */
import type { Account } from "@/types/authTypes/accountTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { AccountsActionCell } from "@/components/actionCells/managements/AccountsActionCell";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { IconActivity, IconMinus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "MaTK",
    header: () => <H k="Mã Tài Khoản" />,
    cell: ({ row }) => <>{row.original.MaTK}</>,
  },
  {
    accessorKey: "MaNV",
    header: () => <H k="Mã Nhân Viên" />,
    cell: ({ row }) => (
      <>
        {row.original.HoVaTen
          ? `${row.original.HoVaTen} (${row.original.MaNV})`
          : row.original.MaNV}
      </>
    ),
  },
  {
    accessorKey: "MaVT",
    header: () => <H k="Vai Trò" />,
    cell: ({ row }) => (
      <>
        {row.original.TenVaiTro
          ? `${row.original.TenVaiTro} (${row.original.MaVT})`
          : row.original.MaVT}
      </>
    ),
  },
  {
    accessorKey: "TenTaiKhoan",
    header: () => <H k="Tên Tài Khoản" />,
    cell: ({ row }) => <>{row.original.TenTaiKhoan}</>,
  },
  {
    accessorKey: "TrangThai",
    header: () => <H k="Trạng Thái" />,
    cell: function CellComponent({ row }) {
      const { t } = useTranslation();
      const status = row.original.TrangThai;
      const isOnline = status === "Online";

      return (
        <div className="flex items-center justify-center">
          <Badge
            variant="outline"
            className={cn(
              "border-transparent transition-colors px-2 cursor-default pointer-events-none",
              isOnline
                ? "bg-insight-success-bg text-insight-success-text"
                : "bg-insight-neutral-bg text-insight-neutral-text",
            )}
          >
            {isOnline ? (
              <IconActivity className="mr-1 size-3.5 shrink-0" />
            ) : (
              <IconMinus className="mr-1 size-3.5 shrink-0" />
            )}
            <span className="truncate font-bold">
              {isOnline ? t("Online") : t("Offline")}
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "MatKhau",
    header: () => <H k="Mật Khẩu" />,
    cell: ({ row }) => <>{row.original.MatKhau}</>,
  },
  {
    accessorKey: "createdAt",
    header: () => <H k="Ngày Tạo" />,
    cell: ({ row }) => <>{row.original.createdAt}</>,
  },
  {
    accessorKey: "updatedAt",
    header: () => <H k="Ngày Cập Nhật" />,
    cell: ({ row }) => <>{row.original.updatedAt}</>,
  },
  {
    id: "actions",
    cell: ({ row }) => <AccountsActionCell acc={row.original} />,
  },
];
