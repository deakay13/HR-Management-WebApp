import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ServerTablePaginationProps {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  itemName?: string;
}

export function ServerTablePagination({
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  itemName = "mục",
}: ServerTablePaginationProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-2 mt-4 mb-2">
      <p className="text-sm text-muted-foreground">
        {t("Tổng")}: <strong>{totalItems}</strong> {t(itemName)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}>
          {t("Trước")}
        </Button>
        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}>
          {t("Sau")}
        </Button>
      </div>
    </div>
  );
}
