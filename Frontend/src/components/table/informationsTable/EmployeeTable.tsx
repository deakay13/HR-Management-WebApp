import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { employeeColumns } from "@/components/table/columns/informations/EmployeesTableColumns";
import type { Employee } from "@/types/informationTypes/employeeTypes";

import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { z } from "zod";
import { getEmployeeValidationSchema } from "@/types/informationTypes/employeeTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { EmployeeServices } from "@/services/informationServices/employeeServices";
import { toast } from "sonner";

export function EmployeeTable({
  data = [],
  loading,
}: {
  data: Employee[];
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
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [openCreate, setOpenCreate] = React.useState(false);
  const [selectedDept, setSelectedDept] = React.useState("");
  const [selectedGender, setSelectedGender] = React.useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filters, setFilters] = React.useState({ keyword: "", MaPB: "" });
  const { permissions } = useAuthorizeStore();

  const { departments, getDepartments } = useDepartmentStore();
  const { createEmployee, searchEmployees } = useEmployeeStore();

  // Debounce auto-search — same logic as AccountsTable
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchEmployees(filters);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchEmployees]);

  const handleExport = async () => {
    try {
      const blob = await EmployeeServices.exportEmployees();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `danh_sach_nhan_vien.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Xuất file excel thành công");
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error("Không thể xuất file excel");
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Employee>({
    data: data || [],
    columns: employeeColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.MaNV.toString(),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const existingCodes = data.map((emp) => emp.MaNV);
    const formValues = {
      MaNV: formData.get("MaNV") as string,
      MaPB: selectedDept,
      HoVaTen: formData.get("HoVaTen") as string,
      GioiTinh: selectedGender,
      NgaySinh: formData.get("NgaySinh") as string,
      SDT: formData.get("SDT") as string,
      NgayVaoLam: formData.get("NgayVaoLam") as string,
      DiaChi: formData.get("DiaChi") as string,
      HinhAnh: (formData.get("HinhAnh") as string) || "",
    };

    try {
      const validatedData =
        getEmployeeValidationSchema(existingCodes).parse(formValues);
      setErrors({});
      await createEmployee(validatedData as Employee);
      setOpenCreate(false);
      setSelectedDept("");
      setSelectedGender("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0])
            newErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  if (loading) {
    return <p className="text-center py-4">Đang tải dữ liệu...</p>;
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section="Danh Mục" page="Nhân Viên" />

        {/* ================== ACTIONS (FILTER) ================== */}
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

          {/* ================== CREATE NEW EMPLOYEE DIALOG ================== */}
          {canCreate(permissions) && (
            <Dialog
              open={openCreate}
              onOpenChange={(val) => {
                setOpenCreate(val);
                if (!val) setErrors({});
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
                  <DialogTitle>{t("Tạo nhân viên mới")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để tạo mới.")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <Label htmlFor="MaNV">{t("Mã nhân viên")}</Label>
                      <Input
                        id="MaNV"
                        name="MaNV"
                        placeholder={t("NVxxx")}
                        className="uppercase"
                      />
                      {errors.MaNV && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaNV || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label>{t("Phòng ban")}</Label>
                      <Select
                        value={selectedDept}
                        onValueChange={setSelectedDept}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Chọn phòng ban")} />
                        </SelectTrigger>
                        <SelectContent>
                          {departments?.map((dept) => (
                            <SelectItem key={dept.MaPB} value={dept.MaPB}>
                              {dept.MaPB} - {dept.TenPB}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.MaPB && (
                        <span className="text-xs text-red-500">
                          {t(errors.MaPB || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="HoVaTen">{t("Họ và tên")}</Label>
                      <Input id="HoVaTen" name="HoVaTen" />
                      {errors.HoVaTen && (
                        <span className="text-xs text-red-500">
                          {t(errors.HoVaTen || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label>{t("Giới tính")}</Label>
                      <Select
                        value={selectedGender}
                        onValueChange={setSelectedGender}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Chọn giới tính")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">{t("Nam")}</SelectItem>
                          <SelectItem value="Nữ">{t("Nữ")}</SelectItem>
                          <SelectItem value="Khác">{t("Khác")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.GioiTinh && (
                        <span className="text-xs text-red-500">
                          {t(errors.GioiTinh || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="NgaySinh">{t("Ngày sinh")}</Label>
                      <Input id="NgaySinh" name="NgaySinh" type="date" />
                      {errors.NgaySinh && (
                        <span className="text-xs text-red-500">
                          {t(errors.NgaySinh || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="SDT">{t("Số điện thoại")}</Label>
                      <Input id="SDT" name="SDT" />
                      {errors.SDT && (
                        <span className="text-xs text-red-500">
                          {t(errors.SDT || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="NgayVaoLam">{t("Ngày vào làm")}</Label>
                      <Input id="NgayVaoLam" name="NgayVaoLam" type="date" />
                      {errors.NgayVaoLam && (
                        <span className="text-xs text-red-500">
                          {t(errors.NgayVaoLam || "")}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="DiaChi">{t("Địa chỉ")}</Label>
                      <Input id="DiaChi" name="DiaChi" />
                      {errors.DiaChi && (
                        <span className="text-xs text-red-500">
                          {t(errors.DiaChi || "")}
                        </span>
                      )}
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        {t("Huỷ")}
                      </Button>
                    </DialogClose>
                    <Button type="submit">{t("Tạo nhân viên")}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {/* ================== END CREATE NEW EMPLOYEE DIALOG ================== */}
        </div>
      </div>

      {/* ================== TABLE CONTENT ================== */}
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
                    colSpan={employeeColumns.length}
                    className="h-24 text-center text-muted-foreground font-roboto"
                  >
                    Không có dữ liệu.
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
