import * as React from "react";
import { IconPlus, IconSearch, IconFileSpreadsheet } from "@tabler/icons-react";
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
import { toast } from "sonner";
import { departmentColumns } from "@/components/table/columns/informations/DepartmentsTableColumns";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import { DepartmentServices } from "@/services/informationServices/departmentServices";
import { CreateDepartmentDialog } from "./dialogs/CreateDepartmentDialog";

export function DepartmentTable({
  data = [],
  loading,
  isEmployee = false,
}: {
  data: Department[];
  loading?: boolean;
  isEmployee?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { permissions } = useAuthorizeStore();

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleExport = async () => {
    try {
      const blob = await DepartmentServices.exportDepartment();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `danh_sach_phong_ban.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t("Xuất file excel thành công"));
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error(t("Không thể xuất file excel"));
    }
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);


  const [openCreate, setOpenCreate] = React.useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Department>({
    data,
    columns: departmentColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.MaPB.toString(),
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

  if (loading) {
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Danh Mục")} page={t("Phòng Ban")} />

        {/* Toolbar - EXACT same as PayRollTable */}
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

          <TableColumnFilter table={table} />

          {!isEmployee && canCreate(permissions) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenCreate(true)}
              >
                <IconPlus />
                <span className="hidden lg:inline">{t("Tạo mới")}</span>
              </Button>
              <CreateDepartmentDialog
                open={openCreate}
                onOpenChange={setOpenCreate}
                existingDepartmentIds={data.map(d => d.MaPB)}
              />
            </>
          )}
        </div>
      </div>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-x-auto rounded-lg border">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      colSpan={header.colSpan} 
                      className="text-center align-middle"
                      style={{ width: header.column.getSize() }}
                    >
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
                      <TableCell 
                        key={cell.id} 
                        className="text-center align-middle"
                        style={{ width: cell.column.getSize() }}
                      >
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
                    colSpan={departmentColumns.length}
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
