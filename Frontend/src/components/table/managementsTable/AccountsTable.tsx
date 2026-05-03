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

import { type Account } from "@/types/authTypes/accountTypes";
import { columns } from "../columns/managements/AccountsTableColumns";

import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";

import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import { CreateAccountDialog } from "./dialogs/CreateAccountDialog";

export function AccountsTable({
  data,
  loading,
}: {
  data: Account[];
  loading?: boolean;
}) {
  const { t } = useTranslation();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { permissions } = useAuthorizeStore();
  const [globalFilter, setGlobalFilter] = React.useState("");

  const { exportAccounts } = useAccountsStore();

  /* eslint-disable-next-line react-hooks/incompatible-library */
  const table = useReactTable<Account>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.MaTK.toString(),
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

  const [createOpen, setCreateOpen] = React.useState(false);

  if (loading) {
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Phân Quyền")} page={t("Tài Khoản")} />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex items-center gap-2">
            <IconSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search...")}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>

          {/* Export Excel */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAccounts()}
            className="h-9 w-9 p-0"
            title={t("Xuất Excel")}>
            <IconFileSpreadsheet size={18} />
          </Button>

          <TableColumnFilter table={table} />

          {/* Button create */}
          {canCreate(permissions) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateOpen(true)}>
                <IconPlus />
                <span className="hidden lg:inline">{t("Tạo mới")}</span>
              </Button>
              <CreateAccountDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
              />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-center">
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
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-center align-middle">
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
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground">
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
