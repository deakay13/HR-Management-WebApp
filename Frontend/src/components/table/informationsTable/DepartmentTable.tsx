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
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { departmentColumns } from "@/components/table/columns/informations/DepartmentsTableColumns";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { getDepartmentValidationSchema } from "@/types/informationTypes/departmentTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import { DepartmentServices } from "@/services/informationServices/departmentServices";

export function DepartmentTable({
  data = [],
  loading,
  isEmployee = false,
}: {
  data: Department[];
  loading?: boolean;
  isEmployee?: boolean;
}) {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [filters, setFilters] = React.useState({
    keyword: "",
  });
  const { createDepartment, searchDepartments, totalPages } = useDepartmentStore();
  const { permissions } = useAuthorizeStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Department>({
    resolver: zodResolver(getDepartmentValidationSchema(data.map(d => d.MaPB))),
    defaultValues: {
      MaPB: "",
      TenPB: "",
    },
  });

  // Debounce auto-search — same logic as PayRollTable
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Khi search, chúng ta muốn lấy toàn bộ dữ liệu khớp để phân trang client-side 
      // HOẶC dùng server-side pagination nếu đã cấu hình store. 
      // Dựa trên yêu cầu số 3, chúng ta dùng server-side.
      searchDepartments({
        ...filters,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchDepartments]);

  const handleExport = async () => {
    try {
      const blob = await DepartmentServices.exportDepartment();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `danh_sach_phong_ban.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t("Xuất file excel thành công"));
    } catch (error) {
      console.error("Lỗi export excel:", error);
      toast.error(t("Không thể xuất file excel"));
    }
  };

  const onSubmit: SubmitHandler<Department> = async (formData) => {
    try {
      await createDepartment(formData);
      setOpenCreate(false);
      reset();
    } catch {
      // Error handled in store toast
    }
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreate, setOpenCreate] = React.useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<Department>({
    data,
    columns: departmentColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount: totalPages,
    manualPagination: true, // Bật manual để phân trang server-side theo yêu cầu #3
    getRowId: (row) => row.MaPB.toString(),
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
        <TableBreadcrumb section={t("Danh Mục")} page={t("Phòng Ban")} />

        {/* Toolbar - EXACT same as PayRollTable */}
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

          <TableColumnFilter table={table} />

          {!isEmployee && canCreate(permissions) && (
            <Dialog 
              open={openCreate} 
              onOpenChange={(open) => {
                setOpenCreate(open);
                if (!open) reset();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    reset();
                  }}
                >
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      {t("Tạo Phòng Ban Mới")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaPB">{t("Mã Phòng Ban")}</Label>
                      <Input
                        id="MaPB"
                        placeholder={t("VD: PB001")}
                        className={`h-10 ${errors.MaPB ? "border-red-500" : ""}`}
                        {...register("MaPB")}
                      />
                      {errors.MaPB && (
                        <p className="text-red-500 text-xs">{t(errors.MaPB.message || "")}</p>
                      )}
                    </Field>

                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TenPB">{t("Tên Phòng Ban")}</Label>
                      <Input
                        id="TenPB"
                        placeholder={t("Nhập tên phòng ban")}
                        className={`h-10 ${errors.TenPB ? "border-red-500" : ""}`}
                        {...register("TenPB")}
                      />
                      {errors.TenPB && (
                        <p className="text-red-500 text-xs">{t(errors.TenPB.message || "")}</p>
                      )}
                    </Field>
                  </FieldGroup>

                  <DialogFooter className="gap-2 mt-4">
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
                    colSpan={departmentColumns.length}
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
