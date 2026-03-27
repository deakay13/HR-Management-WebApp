import { type ColumnDef } from "@tanstack/react-table";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { ContractActionCell } from "@/components/ActionComponets/Informations/ContractActionCell"; 

export const contractColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "MaHopDong",
    header: "Mã HĐ",
  },
  {
    accessorKey: "MaNV",
    header: "Mã NV",
  },
  {
    accessorKey: "LoaiHD",
    header: "Loại HĐ",
  },
  {
    accessorKey: "NgayBatDau",
    header: "Ngày bắt đầu",
  },
  {
    accessorKey: "NgayKetThuc",
    header: "Ngày kết thúc",
  },
  {
    id: "HinhAnhHopDong",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const imgPath = row.original.HinhAnhHopDong;
      if (!imgPath) return "—";
      return (
        <a href={`http://localhost:3000${imgPath}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
          Xem ảnh
        </a>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ContractActionCell contract={row.original} />,
  },
];