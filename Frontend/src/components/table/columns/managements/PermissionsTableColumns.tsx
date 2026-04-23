/* eslint-disable react-refresh/only-export-components */
import type { Permission } from "@/types/permissionTypes/permissionsTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { PermissionActionCell } from "@/components/actionCells/managements/PermissionsActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "MaQuyen",
    header: () => <H k="Mã Quyền" />,
    cell: ({ row }) => <>{row.original.MaQuyen}</>,
  },
  {
    accessorKey: "TenQuyen",
    header: () => <H k="Tên Quyền" />,
    cell: ({ row }) => <>{row.original.TenQuyen}</>,
  },
  {
    id: "actions",
    cell: ({ row }) => <PermissionActionCell permis={row.original} />,
  },
];
