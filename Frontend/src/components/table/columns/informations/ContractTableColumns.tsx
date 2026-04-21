/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef } from "@tanstack/react-table";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { ContractActionCell } from "@/components/actionCells/informations/ContractActionCell";
import { useTranslation } from "react-i18next";

import { getImageUrl, openBase64InNewTab } from "@/utils/imageUtils";

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
      const imgData = row.original.HinhAnhHopDong;
      if (!imgData) return "—";

      const handleView = (e: React.MouseEvent) => {
        e.preventDefault();
        if (imgData.startsWith("data:")) {
          openBase64InNewTab(imgData);
        } else {
          // Legacy path
          window.open(getImageUrl(imgData), "_blank");
        }
      };

      return (
        <button
          onClick={handleView}
          className="text-blue-500 hover:underline cursor-pointer border-none bg-transparent p-0 font-medium">
          <H k="Xem ảnh" />
        </button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ContractActionCell contract={row.original} />,
  },
];
