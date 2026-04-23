import * as React from "react";
import { useEffect } from "react";
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

import { columns } from "../columns/workspace/payRollColumns";
import type { PayRoll, PayRollInput } from "@/types/payRollTypes/payRollTypes";
import { usePayRollStore } from "@/stores/payRollStores/payRollStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import { PayRollServices } from "@/services/payRollServices/payRollServices";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PayRollInputSchema } from "@/types/payRollTypes/payRollTypes";

export function PayRollTable({
  data,
  loading,
  isEmployee = false,
}: {
  data: PayRoll[];
  loading?: boolean;
  isEmployee?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  const [filters, setFilters] = React.useState({
    keyword: "",
    Thang: "",
    TrangThai: "",
  });
  const { createPayRolls, searchPayRolls } = usePayRollStore();
  const { permissions } = useAuthorizeStore();
  const [createOpen, setCreateOpen] = React.useState(false);

  // Form for creation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PayRollInput>({
    resolver: zodResolver(PayRollInputSchema) as any,
    defaultValues: {
      MaBL: "",
      MaNV: "",
      MaKT: "",
      MaPC: "",
      MaLCB: "",
      MaGL: "",
      Thang: "",
      SoNgayLam: 0,
    },
  });

  // Debounce auto-search — same logic as AccountsTable
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchPayRolls(filters);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchPayRolls]);

  const handleExport = async () => {
    try {
      const blob = await PayRollServices.exportPayRoll();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bang_luong.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Xuất file excel thành công");
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error("Không thể xuất file excel");
    }
  };

  const onSubmit = async (data: PayRollInput) => {
    try {
      await createPayRolls(data);
      setCreateOpen(false);
      reset();
    } catch {
      // store handles toast
    }
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<PayRoll>({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.MaBL.toString(),
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
        <TableBreadcrumb section={t("Danh Mục")} page={t("Bảng Lương")} />

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search...")}
                className="h-9 w-[160px] pl-9"
                value={filters.keyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              />
            </div>
            {/* Export only visible for Admin/HR */}
            {!isEmployee && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-9 w-9 p-0"
                title={t("Xuất Excel")}>
                <IconFileSpreadsheet size={18} />
              </Button>
            )}
          </div>

          <TableColumnFilter table={table} />

          {/* Create button — only for Admin/HR */}
          {!isEmployee && canCreate(permissions) && (
            <Dialog open={createOpen} onOpenChange={(open) => {
              setCreateOpen(open);
              if (!open) reset();
            }}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    reset({ MaBL: "", MaNV: "", MaKT: "", MaPC: "", MaLCB: "", MaGL: "", Thang: "", SoNgayLam: 0 });
                    setCreateOpen(true);
                  }}>
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      {t("Tạo bảng lương")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaBL">{t("Mã Bảng Lương")}</Label>
                      <Input
                        id="MaBL"
                        placeholder={t("BLxxx")}
                        className={`h-10 ${errors.MaBL ? "border-red-500" : ""}`}
                        {...register("MaBL")}
                      />
                      {errors.MaBL && (
                        <p className="text-xs text-red-500">{t(errors.MaBL.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
                      <Input
                        id="MaNV"
                        placeholder={t("NVxxx")}
                        className={`h-10 ${errors.MaNV ? "border-red-500" : ""}`}
                        {...register("MaNV")}
                      />
                      {errors.MaNV && (
                        <p className="text-xs text-red-500">{t(errors.MaNV.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaKT">{t("Mã Khấu Trừ")}</Label>
                      <Input
                        id="MaKT"
                        placeholder={t("KTxxx")}
                        className={`h-10 ${errors.MaKT ? "border-red-500" : ""}`}
                        {...register("MaKT")}
                      />
                      {errors.MaKT && (
                        <p className="text-xs text-red-500">{t(errors.MaKT.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
                      <Input
                        id="MaPC"
                        placeholder={t("PCxxx")}
                        className={`h-10 ${errors.MaPC ? "border-red-500" : ""}`}
                        {...register("MaPC")}
                      />
                      {errors.MaPC && (
                        <p className="text-xs text-red-500">{t(errors.MaPC.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaLCB">{t("Mã Lương Cơ Bản")}</Label>
                      <Input
                        id="MaLCB"
                        placeholder={t("LCBxxx")}
                        className={`h-10 ${errors.MaLCB ? "border-red-500" : ""}`}
                        {...register("MaLCB")}
                      />
                      {errors.MaLCB && (
                        <p className="text-xs text-red-500">{t(errors.MaLCB.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaGL">{t("Mã Giờ Làm")}</Label>
                      <Input
                        id="MaGL"
                        placeholder={t("GLxxx")}
                        className={`h-10 ${errors.MaGL ? "border-red-500" : ""}`}
                        {...register("MaGL")}
                      />
                      {errors.MaGL && (
                        <p className="text-xs text-red-500">{t(errors.MaGL.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="Thang">{t("Tháng")}</Label>
                      <Input
                        id="Thang"
                        type="month"
                        className={`h-10 ${errors.Thang ? "border-red-500" : ""}`}
                        {...register("Thang")}
                      />
                      {errors.Thang && (
                        <p className="text-xs text-red-500">{t(errors.Thang.message || "")}</p>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="SoNgayLam">{t("Số ngày công")}</Label>
                      <Input
                        id="SoNgayLam"
                        type="number"
                        placeholder="26"
                        className={`h-10 ${errors.SoNgayLam ? "border-red-500" : ""}`}
                        {...register("SoNgayLam", { valueAsNumber: true })}
                      />
                      {errors.SoNgayLam && (
                        <p className="text-xs text-red-500">{t(errors.SoNgayLam.message || "")}</p>
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
                      disabled={isSubmitting}>
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
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-x-auto rounded-lg border">
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
