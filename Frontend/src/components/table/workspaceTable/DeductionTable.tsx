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
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeductionInputSchema,
  type DeductionInput,
} from "@/types/payRollTypes/deductionTypes";

import { columns } from "../columns/workspace/deductionColumns";
import type { Deduction } from "@/types/payRollTypes/deductionTypes";
import { useDeductionStore } from "@/stores/payRollStores/deductionStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import { toast } from "sonner";
import { useEffect } from "react";

export function DeductionTable({
  data,
  loading,
}: {
  data: Deduction[];
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
  const { createDeduction, searchDeduction } = useDeductionStore();
  const { permissions } = useAuthorizeStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({ keyword: "" });

  // Debounce auto-search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchDeduction(filters);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchDeduction]);

  const handleExport = async () => {
    try {
      const blob = await DeductionServices.exportDeduction();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `danh_sach_khau_tru.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t("Xuất file excel thành công"));
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error(t("Không thể xuất file excel"));
    }
  };
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeductionInput>({
    resolver: zodResolver(DeductionInputSchema),
    defaultValues: { MaKT: "", LoaiKT: "", PhanTram: 0 },
  });

  const onSubmit: SubmitHandler<DeductionInput> = async (data) => {
    try {
      await createDeduction(data);
      setCreateOpen(false);
      reset();
    } catch {
      // store handles toast
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Deduction>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.MaKT.toString(),
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
        <TableBreadcrumb section={t("Danh Mục")} page={t("Khấu Trừ")} />

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search...")}
                className="h-9 w-[160px] pl-9"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                }
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9 w-9 p-0"
              title={t("Xuất Excel")}
            >
              <IconFileSpreadsheet size={18} />
            </Button>
          </div>

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
                      {t("Tạo khấu trừ")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup className="space-y-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaKT">{t("Mã Khấu Trừ")}</Label>
                      <Input
                        id="MaKT"
                        placeholder={t("VD: KT001")}
                        className={`h-10 ${errors.MaKT ? "border-red-500" : ""}`}
                        {...register("MaKT")}
                      />
                      {errors.MaKT && (
                        <p className="text-red-500 text-xs">{t(errors.MaKT.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="LoaiKT">{t("Loại Khấu Trừ")}</Label>
                      <Input
                        id="LoaiKT"
                        placeholder={t("VD: Thuế TNCN")}
                        className={`h-10 ${errors.LoaiKT ? "border-red-500" : ""}`}
                        {...register("LoaiKT")}
                      />
                      {errors.LoaiKT && (
                        <p className="text-red-500 text-xs">{t(errors.LoaiKT.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="PhanTram">{t("Phần Trăm (%)")}</Label>
                      <Input
                        id="PhanTram"
                        type="number"
                        placeholder={t("VD: 10")}
                        className={`h-10 ${errors.PhanTram ? "border-red-500" : ""}`}
                        {...register("PhanTram", { valueAsNumber: true })}
                      />
                      {errors.PhanTram && (
                        <p className="text-red-500 text-xs">{t(errors.PhanTram.message || "")}</p>
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
