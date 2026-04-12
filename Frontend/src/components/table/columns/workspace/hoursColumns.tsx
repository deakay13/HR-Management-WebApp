import type { Hours } from "@/types/payRollTypes/hoursTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { HoursActionCell  } from "@/components/actionCells/workspace/HoursActionCell";

export const columns: ColumnDef<Hours>[] = [
  {
    accessorKey: "MaGL",
    header: () => <div className="w-30 text-center">Mã Giờ Làm </div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.MaGL}</div>
    ),
  },
  {
    accessorKey: "SoGioLam",
    header: () => <div className="w-30 text-center">Số Giờ Làm</div>,
    cell: ({ row }) => (
      <div className="w-30 text-center h-8">{row.original.SoGioLam}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <HoursActionCell hours={row.original} />,
  },
];
