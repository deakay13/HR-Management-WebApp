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
} from "../../ui/breadcrumb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSearch } from "@tabler/icons-react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { columns } from "../Columns/workspace/payRollColumns";
import type { PayRoll } from "@/types/payRollTypes/payRollTypes";
import { usePayRollStore } from "@/stores/payRollStores/payRollStores";
import type { PayRollInput } from "@/types/payRollTypes/payRollTypes";
import { Link } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtiles";

export function PayRollTable({
  data,
  loading,
}: {
  data: PayRoll[];
  loading?: boolean;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
  const isFirstRender = React.useRef(true);
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  React.useEffect(() => {
    // Chỉ chặn duy nhất lần đầu tiên vào trang
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // Dù filter trống cũng gọi search để lấy lại danh sách gốc
      searchPayRolls(filters);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchPayRolls]); // Thêm searchPayRolls vào dependency cho đúng chuẩn
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPayRolls(formData);
  };
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable<PayRoll>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
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
    return <p className="text-center py-4">Đang tải dữ liệu...</p>;
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/*breadcumm */}
        <Breadcrumb className="hidden @4xl/main:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/PortalPage/DashBoard">Dash Board</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Phân quyền</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Bảng lương</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/*button */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-3 px-4 lg:px-6">
            {/* 1. Tìm kiếm văn bản (Keyword) */}
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Mã NV, Mã BL..."
                className="h-9 w-[200px] pl-9"
                value={filters.keyword}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
              />
            </div>

            {/* 2. Chọn Tháng */}
            <Input
              type="month"
              className="h-9 w-[160px]"
              value={filters.Thang}
              onChange={(e) => handleFilterChange("Thang", e.target.value)}
            />
          </div>
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
                          return; // không làm gì
                        }
                        column.toggleVisibility(!!value);
                      }}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Button create */}
          {canCreate(permissions) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({
                      MaBL: "",
                      MaNV: "",
                      MaKT: "",
                      MaPC: "",
                      MaLCB: "",
                      MaGL: "",
                      Thang: "",
                    })
                  }>
                  <IconPlus />
                  <span className="hidden lg:inline">Tạo mới</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleCreate} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Tạo bảng lương
                    </DialogTitle>
                  </DialogHeader>

                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaBL">Mã Bảng Lương</Label>
                      <Input
                        id="MaBL"
                        placeholder="BLxxx"
                        className="h-10"
                        value={formData.MaBL}
                        onChange={(e) =>
                          setFormData({ ...formData, MaBL: e.target.value })
                        }
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">Mã Nhân Viên</Label>
                      <Input
                        id="MaNV"
                        placeholder="NVxxx"
                        className="h-10"
                        value={formData.MaNV}
                        onChange={(e) =>
                          setFormData({ ...formData, MaNV: e.target.value })
                        }
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaKT">Mã Khấu Trừ</Label>
                      <Input
                        id="MaKT"
                        placeholder="KTxxx"
                        className="h-10"
                        value={formData.MaKT}
                        onChange={(e) =>
                          setFormData({ ...formData, MaKT: e.target.value })
                        }
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPC">Mã Phụ Cấp</Label>
                      <Input
                        id="MaPC"
                        placeholder="PCxxx"
                        className="h-10"
                        value={formData.MaPC}
                        onChange={(e) =>
                          setFormData({ ...formData, MaPC: e.target.value })
                        }
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaLCB">Mã Lương Cơ Bản</Label>
                      <Input
                        id="MaLCB"
                        placeholder="LCBxxx"
                        className="h-10"
                        value={formData.MaLCB}
                        onChange={(e) =>
                          setFormData({ ...formData, MaLCB: e.target.value })
                        }
                      />
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaGL">Mã Giờ Làm</Label>
                      <Input
                        id="MaGL"
                        placeholder="GLxxx"
                        className="h-10"
                        value={formData.MaGL}
                        onChange={(e) =>
                          setFormData({ ...formData, MaGL: e.target.value })
                        }
                      />
                    </Field>
                    <Field className="flex flex-col gap-2 md:col-span-2">
                      <Label htmlFor="Thang">Tháng</Label>
                      <Input
                        id="Thang"
                        type="number"
                        placeholder="1 - 12"
                        className="h-10"
                        value={formData.Thang}
                        onChange={(e) =>
                          setFormData({ ...formData, Thang: e.target.value })
                        }
                      />
                    </Field>
                  </FieldGroup>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Huỷ
                      </Button>
                    </DialogClose>

                    <Button
                      type="submit"
                      disabled={
                        !formData.MaBL ||
                        !formData.MaNV ||
                        !formData.MaKT ||
                        !formData.MaPC ||
                        !formData.MaLCB ||
                        !formData.MaGL ||
                        !formData.Thang
                      }>
                      Tạo mới
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
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
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
                    colSpan={columns.length}
                    className="h-24 text-center">
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/*panigations */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} trong số{" "}
            {table.getFilteredRowModel().rows.length} hàng được.
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
