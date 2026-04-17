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

export function PayRollTable({
  data,
  loading,
}: {
  data: PayRoll[];
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [formData, setFormData] = React.useState<PayRollInput>({
    MaBL: "",
    MaNV: "",
    MaKT: "",
    MaPC: "",
    MaLCB: "",
    MaGL: "",
    Thang: "",
  });
  const [filters, setFilters] = React.useState({
    keyword: "",
    Thang: "",
    TrangThai: "",
  });
  const { createPayRolls, searchPayRolls } = usePayRollStore();
  const { permissions } = useAuthorizeStore();

  const handleSearch = () => {
    searchPayRolls(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPayRolls(formData);
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
                placeholder={t("Mã NV, Mã BL...")}
                className="h-9 w-[160px] pl-9"
                value={filters.keyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9 w-9 p-0"
              title={t("Xuất Excel")}>
              <IconFileSpreadsheet size={18} />
            </Button>
          </div>

          <TableColumnFilter table={table} />

          {/* Create button */}
          {canCreate(permissions) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({ MaBL: "", MaNV: "", MaKT: "", MaPC: "", MaLCB: "", MaGL: "", Thang: "" })
                  }>
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleCreate} className="space-y-6">
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
                        className="h-10"
                        value={formData.MaBL}
                        onChange={(e) => setFormData({ ...formData, MaBL: e.target.value })}
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
                      <Input
                        id="MaNV"
                        placeholder={t("NVxxx")}
                        className="h-10"
                        value={formData.MaNV}
                        onChange={(e) => setFormData({ ...formData, MaNV: e.target.value })}
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaKT">{t("Mã Khấu Trừ")}</Label>
                      <Input
                        id="MaKT"
                        placeholder={t("KTxxx")}
                        className="h-10"
                        value={formData.MaKT}
                        onChange={(e) => setFormData({ ...formData, MaKT: e.target.value })}
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
                      <Input
                        id="MaPC"
                        placeholder={t("PCxxx")}
                        className="h-10"
                        value={formData.MaPC}
                        onChange={(e) => setFormData({ ...formData, MaPC: e.target.value })}
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaLCB">{t("Mã Lương Cơ Bản")}</Label>
                      <Input
                        id="MaLCB"
                        placeholder={t("LCBxxx")}
                        className="h-10"
                        value={formData.MaLCB}
                        onChange={(e) => setFormData({ ...formData, MaLCB: e.target.value })}
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaGL">{t("Mã Giờ Làm")}</Label>
                      <Input
                        id="MaGL"
                        placeholder={t("GLxxx")}
                        className="h-10"
                        value={formData.MaGL}
                        onChange={(e) => setFormData({ ...formData, MaGL: e.target.value })}
                      />
                    </Field>

                    <Field className="flex flex-col gap-2 md:col-span-2">
                      <Label htmlFor="Thang">{t("Tháng")}</Label>
                      <Input
                        id="Thang"
                        type="month"
                        className="h-10"
                        value={formData.Thang}
                        onChange={(e) => setFormData({ ...formData, Thang: e.target.value })}
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
                      disabled={
                        !formData.MaBL || !formData.MaNV || !formData.MaKT ||
                        !formData.MaPC || !formData.MaLCB || !formData.MaGL || !formData.Thang
                      }>
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
