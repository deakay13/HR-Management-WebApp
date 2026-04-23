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
    accessorKey: "NgayKy",
    header: () => <H k="Ngày Ký" />,
  },
  {
    accessorKey: "NgayBatDau",
    header: () => <H k="Ngày Bắt Đầu" />,
  },
  {
    accessorKey: "NgayKetThuc",
    header: () => <H k="Ngày Kết Thúc" />,
    cell: ({ row }) => {
      const date = row.original.NgayKetThuc;
      return <span>{date ? date : "—"}</span>;
    },
  },
  {
    accessorKey: "MaPB",
    header: () => <H k="Phòng Ban" />,
  },
  {
    accessorKey: "ChucDanh",
    header: () => <H k="Chức Danh" />,
  },
  {
    accessorKey: "MaLCB",
    header: () => <H k="Lương Cơ Bản" />,
  },
  {
    accessorKey: "MaPC",
    header: () => <H k="Phụ Cấp" />,
  },
  {
    accessorKey: "HinhThucTraLuong",
    header: () => <H k="Hình Thức Trả Lương" />,
  },
  {
    accessorKey: "TinhTrang",
    header: () => <H k="Tình Trạng" />,
    cell: ({ row }) => {
      const status = row.original.TinhTrang;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            status === "Còn hiệu lực"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}>
          {status}
        </span>
      );
    },
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
