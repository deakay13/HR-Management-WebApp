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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { columns } from "../columns/managements/PermissionsTableColumns";
import type { Permission } from "@/types/permissionTypes/permissionsTypes";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";

export function PermissionsTable({
  data,
  loading,
}: {
  data: Permission[];
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const { createPermissions } = usePermissionsStore();
  const { role } = useAuthorizeStore();
  const isAdmin = role?.MaVT === "VT001";
  const [formData, setFormData] = React.useState({ MaQuyen: "", TenQuyen: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPermissions(formData);
    setFormData({ MaQuyen: "", TenQuyen: "" });
  };

  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Permission>({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.MaQuyen.toString(),
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
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Phân Quyền")} page={t("Quyền Hạn")} />
        
        <div className="flex items-center gap-2">
          <TableColumnFilter table={table} />

          {/* Button create - Admin only */}
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ MaQuyen: "", TenQuyen: "" })}>
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleCreate} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>{t("Tạo quyền")}</DialogTitle>
                    <DialogDescription>
                      {t("Hãy nhập thông tin và nhấn Thêm để tạo Quyền")}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaQuyen">{t("Mã Quyền")}</Label>
                      <Input
                        id="MaQuyen"
                        name="MaQuyen"
                        value={formData.MaQuyen}
                        onChange={(e) =>
                          setFormData({ ...formData, MaQuyen: e.target.value })
                        }
                      />
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TenQuyen">{t("Tên Quyền")}</Label>
                      <Input
                        id="TenQuyen"
                        name="TenQuyen"
                        value={formData.TenQuyen}
                        onChange={(e) =>
                          setFormData({ ...formData, TenQuyen: e.target.value })
                        }
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t("Huỷ")}</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={!formData.MaQuyen || !formData.TenQuyen}>
                      {t("Thêm")}
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
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
