import * as React from "react";
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
import { Link } from "react-router-dom";
import { z } from "zod";
import { getContractValidationSchema } from "@/types/informationTypes/contractTypes";
import { useEmployeeStore } from "@/stores/informationStores/employeesStores";

import { contractColumns } from "@/components/Table/Columns/informations/ContractTableColumns";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { useContractStore } from "@/stores/informationStores/contractStore";

export function ContractTable({
  data = [],
  loading,
}: {
  data: Contract[];
  loading?: boolean;
}) {
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

    // Convert FormData to a plain object for Zod validation
    const formValues = {
      MaHopDong: formData.get("MaHopDong") as string,
      MaNV: formData.get("MaNV") as string,
      LoaiHD: formData.get("LoaiHD") as string,
      NgayBatDau: formData.get("NgayBatDau") as string,
      NgayKetThuc: formData.get("NgayKetThuc") as string,
      HinhAnhHopDong: formData.get("HinhAnhHopDong"),
    };

    try {
      // Validate data with Zod
      const validatedData = getContractValidationSchema(
        existingCodes,
        employeeCodes,
      ).parse(formValues);

      formData.set("MaHopDong", validatedData.MaHopDong);
      formData.set("MaNV", validatedData.MaNV);

      // if validation passes, clear errors and proceed to create contract
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

  if (loading) return <p className="text-center py-4">Đang tải dữ liệu...</p>;

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
                <Link to="/PortalPage/Contracts">Hợp đồng</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Action buttons */}
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
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create new contract button */}
          <Dialog
            open={openCreate}
            onOpenChange={(open) => {
              setOpenCreate(open);
              if (!open) setErrors({});
            }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <IconPlus />
                <span className="hidden lg:inline">Tạo mới</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo hợp đồng mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaHopDong">Mã hợp đồng</Label>
                    <Input
                      id="MaHopDong"
                      name="MaHopDong"
                      placeholder="HD001"
                      className="uppercase"
                    />
                    {errors.MaHopDong && (
                      <span className="text-xs text-red-500">
                        {errors.MaHopDong}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="MaNV">Mã nhân viên</Label>
                    <Input id="MaNV" name="MaNV" className="uppercase" />
                    {errors.MaNV && (
                      <span className="text-xs text-red-500">
                        {errors.MaNV}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="LoaiHD">Loại hợp đồng</Label>
                    <Input id="LoaiHD" name="LoaiHD" />
                    {errors.LoaiHD && (
                      <span className="text-xs text-red-500">
                        {errors.LoaiHD}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="NgayBatDau">Ngày bắt đầu</Label>
                    <Input id="NgayBatDau" name="NgayBatDau" type="date" />
                    {errors.NgayBatDau && (
                      <span className="text-xs text-red-500">
                        {errors.NgayBatDau}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="NgayKetThuc">Ngày kết thúc</Label>
                    <Input id="NgayKetThuc" name="NgayKetThuc" type="date" />
                    {errors.NgayKetThuc && (
                      <span className="text-xs text-red-500">
                        {errors.NgayKetThuc}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="HinhAnhHopDong">Hình ảnh (File)</Label>
                    <Input
                      id="HinhAnhHopDong"
                      name="HinhAnhHopDong"
                      type="file"
                      accept=".pdf"
                    />
                    {errors.HinhAnhHopDong && (
                      <span className="text-xs text-red-500">
                        {errors.HinhAnhHopDong}
                      </span>
                    )}
                  </Field>
                </FieldGroup>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Huỷ
                    </Button>
                  </DialogClose>
                  <Button type="submit">Tạo hợp đồng</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
            <TableBody>
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
                    colSpan={contractColumns.length}
                    className="h-24 text-center">
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* === Pagination === */}
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
        {/* === End of Pagination === */}
      </TabsContent>
    </Tabs>
  );
}
