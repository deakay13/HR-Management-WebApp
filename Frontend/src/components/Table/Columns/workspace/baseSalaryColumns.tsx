import type { BaseSalary } from "@/types/payRollTypes/baseSalaryTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { BaseSalaryActionCell  } from "@/components/ActionComponets/workspace/BaseSalaryActionsCell";

export const columns: ColumnDef<BaseSalary>[] = [
  {
    accessorKey: "MaLCB",
    header: () => <div className="w-20 text-center">Mã Lương cơ bản</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaLCB}</div>
    ),
  },
  {
    accessorKey: "LuongCB",
    header: () => <div className="w-20 text-center">Lương Cơ Bản</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.LuongCB }</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <BaseSalaryActionCell baseSalary={row.original} />,
  },
];
