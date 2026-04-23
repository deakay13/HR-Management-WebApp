import * as React from "react";
import { IconPlus, IconSearch, IconFileSpreadsheet } from "@tabler/icons-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ContractServices } from "@/services/informationServices/contractServices";
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
  isEmployee = false,
}: {
  data: Contract[];
  loading?: boolean;
  isEmployee?: boolean;
}) {
  const { t } = useTranslation();
  const { createContract, searchContracts } = useContractStore();
  const { employees, getEmployees } = useEmployeeStore();
  const { permissions } = useAuthorizeStore();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState({
    keyword: "",
    MaPB: "",
    TinhTrang: "",
  });

  const [openCreate, setOpenCreate] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const employeeCodes = React.useMemo(() => employees.map((emp) => emp.MaNV.toUpperCase()), [employees]);
  const existingCodes = React.useMemo(() => data.map((item) => item.MaHopDong), [data]);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(getContractValidationSchema(existingCodes, employeeCodes)),
    defaultValues: {
      MaHopDong: "",
      MaNV: "",
      LoaiHD: "",
      NgayBatDau: "",
      NgayKetThuc: "",
      NgayKy: "",
      ChucDanh: "",
      MaPB: "",
      MaLCB: "",
      MaPC: "",
      HinhThucTraLuong: "",
      TinhTrang: "",
    },
  });

  // Debounce auto-search
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchContracts(filters);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchContracts]);

  const handleExport = async () => {
    try {
      const blob = await ContractServices.exportContract();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `danh_sach_hop_dong.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t("Xuất file excel thành công"));
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error(t("Không thể xuất file excel"));
    }
  };

  const onSubmit: SubmitHandler<any> = async (formData) => {
    try {
      const dataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSubmit.append(key, value as string);
      });
      // Handle file separately if needed, but our schema/form uses typical inputs
      const fileInput = document.getElementById("HinhAnhHopDong") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        dataToSubmit.append("HinhAnhHopDong", fileInput.files[0]);
      }

      await createContract(dataToSubmit);
      setOpenCreate(false);
      reset();
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
    }
  };
  React.useEffect(() => {
    getEmployees();
  }, [getEmployees]);

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

  if (loading)
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Danh Mục")} page={t("Hợp Đồng")} />

        {/* Toolbar */}
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
            {!isEmployee && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-9 w-9 p-0"
                title={t("Xuất Excel")}
              >
                <IconFileSpreadsheet size={18} />
              </Button>
            )}
          </div>

          {/* Default Table Column Filter */}
          <TableColumnFilter table={table} />

          {/* Create new contract button */}
          {!isEmployee && canCreate(permissions) && (
            <Dialog
              open={openCreate}
              onOpenChange={(open) => {
                setOpenCreate(open);
                if (!open) reset();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("Tạo Hợp Đồng Mới")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để tạo mới.")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaHopDong">{t("Mã Hợp Đồng")}</Label>
                      <Input
                        id="MaHopDong"
                        {...register("MaHopDong")}
                        placeholder={t("VD: HD001")}
                        className="uppercase h-10"
                      />
                      {formErrors.MaHopDong && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.MaHopDong.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
                      <Input
                        id="MaNV"
                        {...register("MaNV")}
                        placeholder={t("VD: NV001")}
                        className="uppercase h-10"
                      />
                      {formErrors.MaNV && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.MaNV.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="LoaiHD">{t("Loại Hợp Đồng")}</Label>
                      <Input
                        id="LoaiHD"
                        {...register("LoaiHD")}
                        placeholder={t("VD: Có thời hạn")}
                        className="h-10"
                      />
                      {formErrors.LoaiHD && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.LoaiHD.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="NgayBatDau">{t("Ngày Bắt Đầu")}</Label>
                      <Input
                        id="NgayBatDau"
                        type="date"
                        {...register("NgayBatDau")}
                        className="h-10"
                      />
                      {formErrors.NgayBatDau && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.NgayBatDau.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="NgayKetThuc">{t("Ngày Kết Thúc")}</Label>
                      <Input
                        id="NgayKetThuc"
                        type="date"
                        {...register("NgayKetThuc")}
                        className="h-10"
                      />
                      {formErrors.NgayKetThuc && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.NgayKetThuc.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="NgayKy">{t("Ngày Ký")}</Label>
                      <Input
                        id="NgayKy"
                        type="date"
                        {...register("NgayKy")}
                        className="h-10"
                      />
                      {formErrors.NgayKy && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.NgayKy.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="ChucDanh">{t("Chức Danh")}</Label>
                      <Input
                        id="ChucDanh"
                        {...register("ChucDanh")}
                        placeholder={t("Nhập chức danh")}
                        className={`h-10 ${formErrors.ChucDanh ? "border-red-500" : ""}`}
                      />
                      {formErrors.ChucDanh && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.ChucDanh.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPB">{t("Mã Phòng Ban")}</Label>
                      <Input
                        id="MaPB"
                        {...register("MaPB")}
                        placeholder={t("VD: PB001")}
                        className={`uppercase h-10 ${formErrors.MaPB ? "border-red-500" : ""}`}
                      />
                      {formErrors.MaPB && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.MaPB.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaLCB">{t("Mã Lương CB")}</Label>
                      <Input
                        id="MaLCB"
                        {...register("MaLCB")}
                        placeholder={t("VD: LCB001")}
                        className={`uppercase h-10 ${formErrors.MaLCB ? "border-red-500" : ""}`}
                      />
                      {formErrors.MaLCB && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.MaLCB.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
                      <Input
                        id="MaPC"
                        {...register("MaPC")}
                        placeholder={t("VD: PC001")}
                        className={`uppercase h-10 ${formErrors.MaPC ? "border-red-500" : ""}`}
                      />
                      {formErrors.MaPC && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.MaPC.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="HinhThucTraLuong">{t("Hình Thức Trả Lương")}</Label>
                      <Input
                        id="HinhThucTraLuong"
                        {...register("HinhThucTraLuong")}
                        placeholder={t("VD: Chuyển khoản")}
                        className={`h-10 ${formErrors.HinhThucTraLuong ? "border-red-500" : ""}`}
                      />
                      {formErrors.HinhThucTraLuong && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.HinhThucTraLuong.message as string || "")}
                        </span>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TinhTrang">{t("Tình Trạng")}</Label>
                      <Input
                        id="TinhTrang"
                        {...register("TinhTrang")}
                        placeholder={t("VD: Còn hiệu lực")}
                        className={`h-10 ${formErrors.TinhTrang ? "border-red-500" : ""}`}
                      />
                      {formErrors.TinhTrang && (
                        <span className="text-xs text-red-500">
                          {t(formErrors.TinhTrang.message as string || "")}
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
