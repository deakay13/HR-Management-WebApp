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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { columns } from "../Columns/workspace/allowancesColumns";
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { useAllowanceStore } from "@/stores/payRollStores/allowanceStores";
import { Link } from "react-router-dom";

export function AllowanceTable({
  data,
  loading,
}: {
  data: Allowance[];
  loading?: boolean;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);


  const { createAllowance } = useAllowanceStore();
  const [formData, setFormData] = React.useState({
    MaPC: "",
    LoaiPC: "",
    SoTien: 0,
  });
  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  await createAllowance(formData);

  setFormData({
    MaPC: "",
    LoaiPC: "",
    SoTien: 0,
    });
  };

  
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
            <BreadcrumbItem>
              <BreadcrumbLink>Phân quyền</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/PortalPage/Allowances">Phụ cấp</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/*button */}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  MaPC: "",
                  LoaiPC: "",
                  SoTien: 0,
                })
              }
            >
              <IconPlus />
              <span className="hidden lg:inline">Tạo mới</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreate} className="space-y-6">
            
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Tạo phụ cấp
              </DialogTitle>
            </DialogHeader>

            <Field className="space-y-4">
              {/* MaPC */}
              <FieldGroup className="flex flex-col gap-4">
                <Label htmlFor="MaPC">Mã Phụ Cấp</Label>
                <Input
                  id="MaPC"
                  placeholder="VD: PC001"
                  className="h-10"
                  value={formData.MaPC}
                  onChange={(e) =>
                    setFormData({ ...formData, MaPC: e.target.value })
                  }
                />
              </FieldGroup>

              {/* LoaiPC */}
              <FieldGroup className="flex flex-col gap-4">
                <Label htmlFor="LoaiPC">Loại Phụ Cấp</Label>
                <Input
                  id="LoaiPC"
                  placeholder="VD: Phụ cấp ăn trưa"
                  className="h-10"
                  value={formData.LoaiPC}
                  onChange={(e) =>
                    setFormData({ ...formData, LoaiPC: e.target.value })
                  }
                />
              </FieldGroup>

              {/* SoTien */}
              <FieldGroup className="flex flex-col gap-4">
                <Label htmlFor="SoTien">Số Tiền</Label>
                <Input
                  id="SoTien"
                  type="number"
                  placeholder="VD: 500000"
                  className="h-10"
                  value={formData.SoTien}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      SoTien: Number(e.target.value),
                    })
                  }
                />
              </FieldGroup>
            </Field>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full sm:w-auto"
                >
                  Huỷ
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={
                  !formData.MaPC ||
                  !formData.LoaiPC ||
                  formData.SoTien <= 0
                }
              >
                Tạo mới
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
        </Dialog>
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
