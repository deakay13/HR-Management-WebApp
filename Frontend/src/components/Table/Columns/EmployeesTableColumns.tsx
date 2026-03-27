import { type ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types/informationTypes/employeeTypes";
import { EmployeesActionCell } from "@/components/ActionComponets/Informations/EmployeesActionCell";

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "MaNV",
    header: "Mã NV",
  },
  {
    accessorKey: "HoVaTen",
    header: "Họ và tên",
  },
  {
    accessorKey: "MaPB",
    header: "Phòng ban",
  },
  {
    accessorKey: "GioiTinh",
    header: "Giới tính",
  },
  {
    accessorKey: "NgaySinh",
    header: "Ngày sinh",
    cell: ({ row }) => row.getValue("NgaySinh") || "—",
  },
  {
    accessorKey: "SDT",
    header: "SĐT",
  },
  {
    accessorKey: "NgayVaoLam",
    header: "Ngày vào làm",
    cell: ({ row }) => row.getValue("NgayVaoLam") || "—",
  },
  {
    accessorKey: "DiaChi",
    header: "Địa chỉ",
    cell: ({ row }) => row.getValue("DiaChi") || "—",
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <EmployeesActionCell emp={row.original} />,
  },
];