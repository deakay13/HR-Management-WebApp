import * as React from "react";
import { useEffect, useState } from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { employeeColumns } from "@/components/Table/Columns/informations/EmployeesTableColumns";
import type { Employee } from "@/types/informationTypes/employeeTypes";

import { useEmployeeStore } from "@/stores/informationStores/employeesStores";
import { useDepartmentStore } from "@/stores/informationStores/departmentStores";
import { Link } from "react-router-dom";
import { z } from "zod";
import { getEmployeeValidationSchema } from "@/types/informationTypes/employeeTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtiles";

export function EmployeeTable({
  data = [],
  loading,
}: {
  data: Employee[];
  loading?: boolean;
}) {
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
  const { permissions } = useAuthorizeStore();

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

  const { departments, getDepartments } = useDepartmentStore();
  const { createEmployee } = useEmployeeStore();

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
      className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Breadcrumb className="hidden @4xl/main:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/PortalPage/DashBoard">Dash Board</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Thông tin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/PortalPage/Employees">Nhân viên</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ================== ACTIONS (FILTER) ================== */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Lọc</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  const visibleColumns = table
                    .getAllColumns()
                    .filter((col) => col.getIsVisible());

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        if (!value && visibleColumns.length <= 3) {
                          return;
                        }
                        column.toggleVisibility(!!value);
                      }}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ================== CREATE NEW EMPLOYEE DIALOG ================== */}
          {canCreate(permissions) && (
            <Dialog
              open={openCreate}
              onOpenChange={(val) => {
                setOpenCreate(val);
                if (!val) setErrors({});
              }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconPlus />
                  <span className="hidden lg:inline">Tạo mới</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tạo nhân viên mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <Label htmlFor="MaNV">Mã nhân viên</Label>
                      <Input
                        id="MaNV"
                        name="MaNV"
                        placeholder="NVxxx"
                        className="uppercase"
                      />
                      {errors.MaNV && (
                        <span className="text-xs text-red-500">
                          {errors.MaNV}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label>Phòng ban</Label>
                      <Select
                        value={selectedDept}
                        onValueChange={setSelectedDept}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban" />
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
                          {errors.MaPB}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="HoVaTen">Họ và tên</Label>
                      <Input id="HoVaTen" name="HoVaTen" />
                      {errors.HoVaTen && (
                        <span className="text-xs text-red-500">
                          {errors.HoVaTen}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label>Giới tính</Label>
                      <Select
                        value={selectedGender}
                        onValueChange={setSelectedGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.GioiTinh && (
                        <span className="text-xs text-red-500">
                          {errors.GioiTinh}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="NgaySinh">Ngày sinh</Label>
                      <Input id="NgaySinh" name="NgaySinh" type="date" />
                      {errors.NgaySinh && (
                        <span className="text-xs text-red-500">
                          {errors.NgaySinh}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="SDT">Số điện thoại</Label>
                      <Input id="SDT" name="SDT" />
                      {errors.SDT && (
                        <span className="text-xs text-red-500">
                          {errors.SDT}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="NgayVaoLam">Ngày vào làm</Label>
                      <Input id="NgayVaoLam" name="NgayVaoLam" type="date" />
                      {errors.NgayVaoLam && (
                        <span className="text-xs text-red-500">
                          {errors.NgayVaoLam}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <Label htmlFor="DiaChi">Địa chỉ</Label>
                      <Input id="DiaChi" name="DiaChi" />
                      {errors.DiaChi && (
                        <span className="text-xs text-red-500">
                          {errors.DiaChi}
                        </span>
                      )}
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Huỷ
                      </Button>
                    </DialogClose>
                    <Button type="submit">Tạo nhân viên</Button>
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
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    className="h-24 text-center">
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ================== PAGINATION & INFO ================== */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} trong số{" "}
            {table.getFilteredRowModel().rows.length} hàng.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                số hàng trên mỗi trang
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}>
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Trang {table.getState().pagination.pageIndex + 1} trên{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
