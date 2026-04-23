/* eslint-disable react-refresh/only-export-components */
import { RolesActionCell } from "@/components/actionCells/managements/RolesActionCell";
import type { RoleWithPermissions } from "@/types/permissionTypes/roleGrantPermissionsTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const columns: ColumnDef<RoleWithPermissions>[] = [
  {
    accessorKey: "MaVT",
    header: () => <H k="Mã Vai Trò" />,
    cell: ({ row }) => <>{row.original.MaVT}</>,
  },
  {
    accessorKey: "TenVaiTro",
    header: () => <H k="Tên Vai Trò" />,
    cell: ({ row }) => <>{row.original.TenVaiTro}</>,
  },
  {
    accessorKey: "permissions",
    header: () => <H k="Quyền Được Cấp" />,
    cell: ({ row }) => (
      <>{row.original.permissions?.map((p) => p.TenQuyen).join(", ")}</>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RolesActionCell rol={row.original} />,
  },
];
