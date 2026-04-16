/* eslint-disable react-refresh/only-export-components */
import { RolesActionCell } from "@/components/actionCells/managements/RolesActionCell";
import type { RoleWithPermissions } from "@/types/permissionTypes/roleGrantPermissionsTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <div className="w-full text-center">{t(k)}</div>;
}

export const columns: ColumnDef<RoleWithPermissions>[] = [
  {
    accessorKey: "MaVT",
    header: () => <H k="Mã Vai Trò" />,
    cell: ({ row }) => (
      <div className="w-full text-center h-8">{row.original.MaVT}</div>
    ),
  },
  {
    accessorKey: "TenVaiTro",
    header: () => <H k="Tên Vai Trò" />,
    cell: ({ row }) => (
      <div className="w-full text-center h-8">{row.original.TenVaiTro}</div>
    ),
  },
  {
    accessorKey: "permissions",
    header: () => <H k="Quyền Được Cấp" />,
    cell: ({ row }) => (
      <div className="w-full text-center h-8">
        {row.original.permissions?.map((p) => p.TenQuyen).join(", ")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RolesActionCell rol={row.original} />,
  },
];
