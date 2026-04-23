import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";
import { COLUMN_LABEL_MAP } from "@/lib/columnLabelMap";
import type { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface TableColumnFilterProps<TData> {
  table: Table<TData>;
}

export function TableColumnFilter<TData>({
  table,
}: TableColumnFilterProps<TData>) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <IconLayoutColumns />
          <span className="hidden lg:inline">{t("Lọc")}</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            const visibleColumns = table
              .getAllColumns()
              .filter((col) => col.getIsVisible());
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => {
                  if (!value && visibleColumns.length <= 3) return;
                  column.toggleVisibility(!!value);
                }}
              >
                {t(COLUMN_LABEL_MAP[column.id] ?? column.id)}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
