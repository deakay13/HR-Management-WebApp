import { RolesActionsCell } from "@/components/ActionComponets/Managements/RolesActionsCell";
import type { Role } from "@/types/permissionTypes/RolesTypes";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "MaVT",
    header: () => <div className="w-30 text-center">Mã Vai Trò</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaVT}</div>
    ),
  },
  {
    accessorKey: "TenVaiTro",
    header: () => <div className="w-30 text-center">Tên Vai Trò</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.TenVaiTro}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RolesActionsCell rol={row.original} />,
  },
];
