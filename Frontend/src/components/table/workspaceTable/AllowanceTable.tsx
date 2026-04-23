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
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AllowanceInputSchema,
  type AllowanceInput,
} from "@/types/payRollTypes/allowanceTypes";
import { columns } from "../columns/workspace/allowancesColumns";
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { useAllowanceStore } from "@/stores/payRollStores/allowanceStore";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

export function AllowanceTable({
  data,
  loading,
}: {
  data: Allowance[];
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

  const { createAllowance } = useAllowanceStore();
  const { permissions } = useAuthorizeStore();
  const [createOpen, setCreateOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AllowanceInput>({
    resolver: zodResolver(AllowanceInputSchema),
    defaultValues: { MaPC: "", LoaiPC: "", SoTien: 0 },
  });

  const onSubmit: SubmitHandler<AllowanceInput> = async (data) => {
    try {
      await createAllowance(data);
      setCreateOpen(false);
      reset();
    } catch {
      // store handles toast
    }
  };

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Allowance>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.MaPC.toString(),
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
        <TableBreadcrumb section={t("Danh Mục")} page={t("Phụ Cấp")} />

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
                    reset();
                    setCreateOpen(true);
                  }}
                >
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      {t("Tạo phụ cấp")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup className="space-y-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
                      <Input
                        id="MaPC"
                        placeholder={t("VD: PC001")}
                        className={`h-10 ${errors.MaPC ? "border-red-500" : ""}`}
                        {...register("MaPC")}
                      />
                      {errors.MaPC && (
                        <p className="text-red-500 text-xs">{t(errors.MaPC.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="LoaiPC">{t("Loại Phụ Cấp")}</Label>
                      <Input
                        id="LoaiPC"
                        placeholder={t("VD: Phụ cấp ăn trưa")}
                        className={`h-10 ${errors.LoaiPC ? "border-red-500" : ""}`}
                        {...register("LoaiPC")}
                      />
                      {errors.LoaiPC && (
                        <p className="text-red-500 text-xs">{t(errors.LoaiPC.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="SoTien">{t("Số Tiền")}</Label>
                      <Input
                        id="SoTien"
                        type="number"
                        placeholder={t("VD: 500000")}
                        className={`h-10 ${errors.SoTien ? "border-red-500" : ""}`}
                        {...register("SoTien", { valueAsNumber: true })}
                      />
                      {errors.SoTien && (
                        <p className="text-red-500 text-xs">{t(errors.SoTien.message || "")}</p>
                      )}
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
                      disabled={isSubmitting}
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
