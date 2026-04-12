import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { AllowanceActionCell } from "@/components/actionCells/workspace/AllowanceActionCell";

export const columns: ColumnDef<Allowance>[] = [
  {
    accessorKey: "MaPC",
    header: () => <div className="w-30 text-center">Mã Phụ Cấp</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaPC}</div>
    ),
  },
  {
    accessorKey: "LoaiPC",
    header: () => <div className="w-30 text-center">Loại Phụ Cấp</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.LoaiPC}</div>
    ),
  },
  {
    accessorKey: "SoTien",
    header: () => <div className="w-30 text-center">Số Tiền</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">
        {row.original.SoTien.toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <AllowanceActionCell allowance={row.original} />,
  },
];
