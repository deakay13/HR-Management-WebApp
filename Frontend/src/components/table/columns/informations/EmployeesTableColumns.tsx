/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types/informationTypes/employeeTypes";
import { EmployeesActionCell } from "@/components/actionCells/informations/EmployeesActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "MaNV",
    header: () => <H k="Mã NV" />,
  },
  {
    accessorKey: "HoVaTen",
    header: () => <H k="Họ Và Tên" />,
  },
  {
    accessorKey: "MaPB",
    header: () => <H k="Phòng Ban" />,
    cell: ({ row }) => (
      <div className="w-40 text-left">
        {row.original.PhongBan ? `${row.original.PhongBan.TenPB} (${row.original.MaPB})` : row.original.MaPB}
      </div>
    ),
  },
  {
    accessorKey: "GioiTinh",
    header: () => <H k="Giới Tính" />,
  },
  {
    accessorKey: "NgaySinh",
    header: () => <H k="Ngày Sinh" />,
    cell: ({ row }) => row.getValue("NgaySinh") || "—",
  },
  {
    accessorKey: "SDT",
    header: () => <H k="SĐT" />,
  },
  {
    accessorKey: "NgayVaoLam",
    header: () => <H k="Ngày Vào Làm" />,
    cell: ({ row }) => row.getValue("NgayVaoLam") || "—",
  },
  {
    accessorKey: "DiaChi",
    header: () => <H k="Địa Chỉ" />,
    cell: ({ row }) => row.getValue("DiaChi") || "—",
  },
  {
    id: "actions",
    cell: ({ row }) => <EmployeesActionCell emp={row.original} />,
  },
];
