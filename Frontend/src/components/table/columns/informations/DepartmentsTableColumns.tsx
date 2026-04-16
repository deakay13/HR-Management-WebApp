/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef } from "@tanstack/react-table";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { DepartmentActionCell } from "@/components/actionCells/informations/DepartmentActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const departmentColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "MaPB",
    header: () => <H k="Mã Phòng Ban" />,
  },
  {
    accessorKey: "TenPB",
    header: () => <H k="Tên Phòng Ban" />,
  },
  {
    id: "actions",
    cell: ({ row }) => <DepartmentActionCell dept={row.original} />,
  },
];
