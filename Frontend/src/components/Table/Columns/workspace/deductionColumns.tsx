import type { Deduction } from "@/types/payRollTypes/deductionTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { DeductionActionCell  } from "@/components/ActionComponets/workspace/DeductionActionsCell";

export const columns: ColumnDef<Deduction>[] = [
  {
    accessorKey: "MaKT",
    header: () => <div className="w-20 text-center">Mã Khấu trừ</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaKT}</div>
    ),
  },
  {
    accessorKey: "LoaiKT",
    header: () => <div className="w-20 text-center">Loại Khấu Trừ</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.LoaiKT }</div>
    ),
  },
  {
    accessorKey: "PhanTram",
    header: () => <div className="w-20 text-center">Phần Trăm</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.PhanTram }</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DeductionActionCell deduction={row.original} />,
  },
];
