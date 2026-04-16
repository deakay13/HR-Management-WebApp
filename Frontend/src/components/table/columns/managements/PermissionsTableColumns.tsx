/* eslint-disable react-refresh/only-export-components */
import type { Permission } from "@/types/permissionTypes/permissionsTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { PermissionActionCell } from "@/components/actionCells/managements/PermissionsActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <div className="w-30 text-center">{t(k)}</div>;
}

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "MaQuyen",
    header: () => <H k="Mã Quyền" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaQuyen}</div>
    ),
  },
  {
    accessorKey: "TenQuyen",
    header: () => <H k="Tên Quyền" />,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.TenQuyen}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <PermissionActionCell permis={row.original} />,
  },
];
