import { type ColumnDef } from "@tanstack/react-table";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { DepartmentActionCell } from "@/components/ActionComponets/Informations/DepartmentActionCell";

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
    accessorKey: "MoTa",
    header: "Mô tả",
    cell: ({ row }) => row.getValue("MoTa") || "—",
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <DepartmentActionCell dept={row.original} />,
  },
];