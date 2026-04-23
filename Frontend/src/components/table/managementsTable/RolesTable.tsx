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

import { columns } from "../columns/managements/RolesTableColumns";
import type { RoleWithPermissions } from "@/types/permissionTypes/roleGrantPermissionsTypes";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleInputSchema, type RoleInput } from "@/types/permissionTypes/rolesTypes";

export function RolesTable({
  data,
  loading,
}: {
  data: RoleWithPermissions[];
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const { createRoles } = useRolesStore();
  const { role } = useAuthorizeStore();
  const isAdmin = role?.MaVT === "VT001";
  const [createOpen, setCreateOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleInput>({
    resolver: zodResolver(RoleInputSchema) as any,
    defaultValues: {
      MaVT: "",
      TenVaiTro: "",
    },
  });

  const onSubmit = async (data: RoleInput) => {
    try {
      await createRoles(data);
      setCreateOpen(false);
      reset();
    } catch {
      // store handles toast
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<RoleWithPermissions>({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.MaVT.toString(),
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
        <TableBreadcrumb section={t("Phân Quyền")} page={t("Vai Trò")} />
        
        <div className="flex items-center gap-2">
          <TableColumnFilter table={table} />

          {/* Button create */}
          {isAdmin && (
            <Dialog open={createOpen} onOpenChange={(open) => {
              setCreateOpen(open);
              if (!open) reset();
            }}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    reset({ MaVT: "", TenVaiTro: "" });
                    setCreateOpen(true);
                  }}>
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>{t("Tạo vai trò")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaVT">{t("Mã Vai Trò")}</Label>
                      <Input
                        id="MaVT"
                        placeholder="VTxxx"
                        className={`h-10 ${errors.MaVT ? "border-red-500" : ""}`}
                        {...register("MaVT")}
                      />
                      {errors.MaVT && (
                        <p className="text-xs text-red-500">{errors.MaVT.message}</p>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TenVaiTro">{t("Tên Vai Trò")}</Label>
                      <Input
                        id="TenVaiTro"
                        placeholder={t("VD: Nhân viên")}
                        className={`h-10 ${errors.TenVaiTro ? "border-red-500" : ""}`}
                        {...register("TenVaiTro")}
                      />
                      {errors.TenVaiTro && (
                        <p className="text-xs text-red-500">{errors.TenVaiTro.message}</p>
                      )}
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t("Huỷ")}</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={isSubmitting}>
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
