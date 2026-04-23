import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { columns } from "../columns/workspace/baseSalaryColumns";
import type { BaseSalary } from "@/types/payRollTypes/baseSalaryTypes";
import { useBaseSalaryStore } from "@/stores/payRollStores/baseSalaryStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

export function BaseSalaryTable({
  data,
  loading,
}: {
  data: BaseSalary[];
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { createBaseSalary } = useBaseSalaryStore();
  const { permissions } = useAuthorizeStore();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ MaLCB: "", LuongCB: 0 });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBaseSalary(formData);
      setCreateOpen(false);
      setFormData({ MaLCB: "", LuongCB: 0 });
    } catch {
      // store handles toast
    }
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<BaseSalary>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.MaLCB.toString(),
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
        <TableBreadcrumb section={t("Danh Mục")} page={t("Lương Cơ Bản")} />

        <div className="flex items-center gap-2">
          <TableColumnFilter table={table} />

          {/* Create button */}
          {canCreate(permissions) && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ MaLCB: "", LuongCB: 0 });
                    setCreateOpen(true);
                  }}
                >
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleCreate} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      {t("Tạo lương cơ bản")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="space-y-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaLCB">{t("Mã Lương Cơ Bản")}</Label>
                      <Input
                        id="MaLCB"
                        placeholder={t("VD: LCB001")}
                        className="h-10"
                        value={formData.MaLCB}
                        onChange={(e) =>
                          setFormData({ ...formData, MaLCB: e.target.value })
                        }
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="LuongCB">{t("Lương Cơ Bản")}</Label>
                      <Input
                        id="LuongCB"
                        type="number"
                        placeholder={t("VD: 5000000")}
                        className="h-10"
                        value={formData.LuongCB}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            LuongCB: Number(e.target.value),
                          })
                        }
                      />
                    </Field>
                  </FieldGroup>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        {t("Huỷ")}
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={!formData.MaLCB || formData.LuongCB <= 0}
                    >
                      {t("Tạo mới")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Table */}
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
                    <TableHead key={header.id} colSpan={header.colSpan} className="text-center">
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
                    colSpan={columns.length}
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
