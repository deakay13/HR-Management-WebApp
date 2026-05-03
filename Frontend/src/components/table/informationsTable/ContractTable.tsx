import * as React from "react";
import { IconPlus, IconSearch, IconFileSpreadsheet } from "@tabler/icons-react";
import { toast } from "sonner";
import { ContractServices } from "@/services/informationServices/contractServices";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

import { contractColumns } from "@/components/table/columns/informations/ContractTableColumns";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { CreateContractDialog } from "./dialogs/CreateContractDialog";

export function ContractTable({
  data = [],
  loading,
  isEmployee = false,
}: {
  data: Contract[];
  loading?: boolean;
  isEmployee?: boolean;
}) {
  const { t } = useTranslation();
  const { permissions } = useAuthorizeStore();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [openCreate, setOpenCreate] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const existingCodes = React.useMemo(() => data.map((item) => item.MaHopDong), [data]);

  const handleExport = async () => {
    try {
      const blob = await ContractServices.exportContract();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `danh_sach_hop_dong.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t("Xuất file excel thành công"));
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error(t("Không thể xuất file excel"));
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Contract>({
    data: data || [],
    columns: contractColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.MaHopDong,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (loading)
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Danh Mục")} page={t("Hợp Đồng")} />

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search...")}
                className="h-9 w-[160px] pl-9"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            {!isEmployee && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-9 w-9 p-0"
                title={t("Xuất Excel")}
              >
                <IconFileSpreadsheet size={18} />
              </Button>
            )}
          </div>

          {/* Default Table Column Filter */}
          <TableColumnFilter table={table} />

          {/* Create new contract button */}
          {!isEmployee && canCreate(permissions) && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setOpenCreate(true)}
              >
                <IconPlus />
                <span className="hidden lg:inline">{t("Tạo mới")}</span>
              </Button>
              <CreateContractDialog
                open={openCreate}
                onOpenChange={setOpenCreate}
                existingCodes={existingCodes}
              />
            </>
          )}
        </div>
      </div>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center align-middle">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={contractColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("Không có dữ liệu.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </TabsContent>
    </Tabs>
  );
}
