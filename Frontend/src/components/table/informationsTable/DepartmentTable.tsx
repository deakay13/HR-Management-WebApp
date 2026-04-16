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
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

import { departmentColumns } from "@/components/table/columns/informations/DepartmentsTableColumns";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { z } from "zod";
import { getDepartmentValidationSchema } from "@/types/informationTypes/departmentTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";

export function DepartmentTable({
  data = [],
  loading,
}: {
  data: Department[];
  loading?: boolean;
}) {
  const { t } = useTranslation();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { permissions } = useAuthorizeStore();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Department>({
    data: data || [],
    columns: departmentColumns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
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

  const { createDepartment } = useDepartmentStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const existingCodes = data.map((item) => item.MaPB);

    const formValues = {
      MaPB: formData.get("MaPB") as string,
      TenPB: formData.get("TenPB") as string,
    };

    try {
      getDepartmentValidationSchema(existingCodes).parse(formValues);
      setErrors({});
      await createDepartment(formValues);
      setOpenCreate(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  if (loading) return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Danh Mục")} page={t("Phòng Ban")} />

        <div className="flex items-center gap-2">
          <TableColumnFilter table={table} />

          {canCreate(permissions) && (
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("Tạo Phòng Ban Mới")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <FieldGroup className="space-y-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPB">{t("Mã Phòng Ban")}</Label>
                      <Input id="MaPB" name="MaPB" placeholder={t("VD: PB001")} className="h-10" />
                      {errors.MaPB && (
                        <span className="text-xs text-red-500">
                          {errors.MaPB}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TenPB">{t("Tên Phòng Ban")}</Label>
                      <Input id="TenPB" name="TenPB" className="h-10" />
                      {errors.TenPB && (
                        <span className="text-xs text-red-500">
                          {errors.TenPB}
                        </span>
                      )}
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-4 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        {t("Huỷ")}
                      </Button>
                    </DialogClose>
                    <Button type="submit">{t("Tạo phòng ban")}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                  <TableRow key={row.id}>
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
                    colSpan={departmentColumns.length}
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
