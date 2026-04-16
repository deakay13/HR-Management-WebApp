/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef } from "@tanstack/react-table";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { ContractActionCell } from "@/components/actionCells/informations/ContractActionCell";
import { useTranslation } from "react-i18next";

function H({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export const contractColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "MaHopDong",
    header: () => <H k="Mã HĐ" />,
  },
  {
    accessorKey: "MaNV",
    header: () => <H k="Mã NV" />,
  },
  {
    accessorKey: "LoaiHD",
    header: () => <H k="Loại HĐ" />,
  },
  {
    accessorKey: "NgayBatDau",
    header: () => <H k="Ngày Bắt Đầu" />,
  },
  {
    accessorKey: "NgayKetThuc",
    header: () => <H k="Ngày Kết Thúc" />,
  },
  {
    id: "HinhAnhHopDong",
    header: () => <H k="Hình Ảnh" />,
    cell: ({ row }) => {
      const imgPath = row.original.HinhAnhHopDong;
      if (!imgPath) return "—";
      return (
        <a
          href={`http://localhost:3000${imgPath}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline">
          <H k="Xem ảnh" />
        </a>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ContractActionCell contract={row.original} />,
  },
];
