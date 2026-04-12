import { RolesActionCell } from "@/components/actionCells/managements/RolesActionCell";
import type { RoleWithPermissions } from "@/types/permissionTypes/roleGrantPermissionsTypes";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<RoleWithPermissions>[] = [
  {
    accessorKey: "MaVT",
    header: () => <div className="w-full text-center">Mã Vai Trò</div>,
    cell: ({ row }) => (
      <div className="w-full text-center h-8">{row.original.MaVT}</div>
    ),
  },
  {
    accessorKey: "TenVaiTro",
    header: () => <div className="w-full text-center">Tên Vai Trò</div>,
    cell: ({ row }) => (
      <div className="w-full text-center h-8">{row.original.TenVaiTro}</div>
    ),
  },
  {
    accessorKey: "permissions",
    header: () => <div className="w-full text-center">Quyền được cấp</div>,
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
