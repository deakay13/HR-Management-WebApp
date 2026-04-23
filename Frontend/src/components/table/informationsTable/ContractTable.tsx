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
import { z } from "zod";
import { getContractValidationSchema } from "@/types/informationTypes/contractTypes";
import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

import { contractColumns } from "@/components/table/columns/informations/ContractTableColumns";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { useContractStore } from "@/stores/informationStores/contractStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";

export function ContractTable({
  data = [],
  loading,
}: {
  data: Contract[];
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

  const [openCreate, setOpenCreate] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { employees, getEmployees } = useEmployeeStore();
  const { permissions } = useAuthorizeStore();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Contract>({
    data: data || [],
    columns: contractColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.MaHopDong,
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

  const { createContract } = useContractStore();
  React.useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employeeCodes = employees.map((emp) => emp.MaNV.toUpperCase());
    const existingCodes = data.map((item) => item.MaHopDong);

    const formValues = {
      MaHopDong: formData.get("MaHopDong") as string,
      MaNV: formData.get("MaNV") as string,
      LoaiHD: formData.get("LoaiHD") as string,
      NgayBatDau: formData.get("NgayBatDau") as string,
      NgayKetThuc: formData.get("NgayKetThuc") as string,
      NgayKy: formData.get("NgayKy") as string,
      ChucDanh: formData.get("ChucDanh") as string,
      MaPB: formData.get("MaPB") as string,
      MaLCB: formData.get("MaLCB") as string,
      MaPC: formData.get("MaPC") as string,
      HinhThucTraLuong: formData.get("HinhThucTraLuong") as string,
      TinhTrang: formData.get("TinhTrang") as string,
      HinhAnhHopDong: formData.get("HinhAnhHopDong"),
    };

    try {
      const validatedData = getContractValidationSchema(
        existingCodes,
        employeeCodes,
      ).parse(formValues);

      formData.set("MaHopDong", validatedData.MaHopDong);
      formData.set("MaNV", validatedData.MaNV);

      setErrors({});
      await createContract(formData);
      setOpenCreate(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  if (loading)
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Danh Mục")} page={t("Hợp Đồng")} />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Default Table Column Filter */}
          <TableColumnFilter table={table} />

          {/* Create new contract button */}
          {canCreate(permissions) && (
            <Dialog
              open={openCreate}
              onOpenChange={(open) => {
                setOpenCreate(open);
                if (!open) setErrors({});
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("Tạo Hợp Đồng Mới")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để tạo mới.")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <FieldGroup className="space-y-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaHopDong">{t("Mã Hợp Đồng")}</Label>
                      <Input
                        id="MaHopDong"
                        name="MaHopDong"
                        placeholder={t("VD: HD001")}
                        className="uppercase h-10"
                      />
                      {errors.MaHopDong && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaHopDong || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
                      <Input
                        id="MaNV"
                        name="MaNV"
                        placeholder={t("VD: NV001")}
                        className="uppercase h-10"
                      />
                      {errors.MaNV && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaNV || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="LoaiHD">{t("Loại Hợp Đồng")}</Label>
                      <Input
                        id="LoaiHD"
                        name="LoaiHD"
                        placeholder={t("VD: Có thời hạn")}
                        className="h-10"
                      />
                      {errors.LoaiHD && (
                        <span className="text-xs text-red-500">
                          {t(errors.LoaiHD || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="NgayBatDau">{t("Ngày Bắt Đầu")}</Label>
                      <Input
                        id="NgayBatDau"
                        name="NgayBatDau"
                        type="date"
                        className="h-10"
                      />
                      {errors.NgayBatDau && (
                        <span className="text-xs text-red-500">
                          {t(errors.NgayBatDau || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="NgayKetThuc">{t("Ngày Kết Thúc")}</Label>
                      <Input
                        id="NgayKetThuc"
                        name="NgayKetThuc"
                        type="date"
                        className="h-10"
                      />
                      {errors.NgayKetThuc && (
                        <span className="text-xs text-red-500">
                          {t(errors.NgayKetThuc || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="NgayKy">{t("Ngày Ký")}</Label>
                      <Input
                        id="NgayKy"
                        name="NgayKy"
                        type="date"
                        className="h-10"
                      />
                      {errors.NgayKy && (
                        <span className="text-xs text-red-500">
                          {errors.NgayKy}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="ChucDanh">{t("Chức Danh")}</Label>
                      <Input
                        id="ChucDanh"
                        name="ChucDanh"
                        placeholder={t("Nhập chức danh")}
                        className={`h-10 ${errors.ChucDanh ? "border-red-500" : ""}`}
                      />
                      {errors.ChucDanh && (
                        <span className="text-xs text-red-500">
                          {t(errors.ChucDanh || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPB">{t("Mã Phòng Ban")}</Label>
                      <Input
                        id="MaPB"
                        name="MaPB"
                        placeholder={t("VD: PB001")}
                        className={`uppercase h-10 ${errors.MaPB ? "border-red-500" : ""}`}
                      />
                      {errors.MaPB && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaPB || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaLCB">{t("Mã Lương CB")}</Label>
                      <Input
                        id="MaLCB"
                        name="MaLCB"
                        placeholder={t("VD: LCB001")}
                        className={`uppercase h-10 ${errors.MaLCB ? "border-red-500" : ""}`}
                      />
                      {errors.MaLCB && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaLCB || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
                      <Input
                        id="MaPC"
                        name="MaPC"
                        placeholder={t("VD: PC001")}
                        className={`uppercase h-10 ${errors.MaPC ? "border-red-500" : ""}`}
                      />
                      {errors.MaPC && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaPC || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="HinhThucTraLuong">{t("Hình Thức Trả Lương")}</Label>
                      <Input
                        id="HinhThucTraLuong"
                        name="HinhThucTraLuong"
                        placeholder={t("VD: Chuyển khoản")}
                        className={`h-10 ${errors.HinhThucTraLuong ? "border-red-500" : ""}`}
                      />
                      {errors.HinhThucTraLuong && (
                        <span className="text-xs text-red-500">
                          {t(errors.HinhThucTraLuong || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TinhTrang">{t("Tình Trạng")}</Label>
                      <Input
                        id="TinhTrang"
                        name="TinhTrang"
                        placeholder={t("VD: Còn hiệu lực")}
                        className={`h-10 ${errors.TinhTrang ? "border-red-500" : ""}`}
                      />
                      {errors.TinhTrang && (
                        <span className="text-xs text-red-500">
                          {t(errors.TinhTrang || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="HinhAnhHopDong">
                        {t("Hình ảnh (File)")}
                      </Label>
                      <Input
                        id="HinhAnhHopDong"
                        name="HinhAnhHopDong"
                        type="file"
                        accept=".pdf"
                        className="h-10"
                      />
                      {errors.HinhAnhHopDong && (
                        <span className="text-xs text-red-500">
                          {t(errors.HinhAnhHopDong || "")}
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
                    <Button type="submit">{t("Tạo mới")}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

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
                    <TableHead key={header.id} className="text-center align-middle">
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
                    colSpan={contractColumns.length}
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
