import { type ColumnDef } from "@tanstack/react-table";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { DepartmentActionCell } from "@/components/actionCells/informations/DepartmentActionCell";

export const departmentColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "MaPB",
    header: "Mã phòng ban",
  },
  {
    accessorKey: "TenPB",
    header: "Tên phòng ban",
  },
  {
    id: "actions",
    cell: ({ row }) => <DepartmentActionCell dept={row.original} />,
  },
];