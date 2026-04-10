import type { Permission } from "@/types/permissionTypes/PermissionsTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { PermissionActionCell } from "@/components/ActionComponets/Managements/PermissionsActionCell";

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "MaQuyen",
    header: () => <div className="w-30 text-center">Mã Quyền</div>,
    cell: ({ row }) => (
      <div className="w-30text-center h-8">{row.original.MaQuyen}</div>
    ),
  },
  {
    accessorKey: "TenQuyen",
    header: () => <div className="w-30 text-center">Tên Quyền</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.TenQuyen}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <PermissionActionCell permis={row.original} />,
  },
];
