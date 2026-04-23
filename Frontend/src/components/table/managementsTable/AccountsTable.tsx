import * as React from "react";
import { useEffect } from "react";
import { IconPlus, IconDownload, IconSearch } from "@tabler/icons-react";
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
  Select,
  SelectContent,
  SelectGroup,
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

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountInputSchema,
  type AccountInput,
  type Account,
} from "@/types/authTypes/accountTypes";
import { columns } from "../columns/managements/AccountsTableColumns";
import type { Role } from "@/types/permissionTypes/rolesTypes";

import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canCreate } from "@/utils/authorizeUtils";
import { TablePagination } from "@/components/table/shared/TablePagination";
import { TableBreadcrumb } from "@/components/table/shared/TableBreadcrumb";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";

export function AccountsTable({
  data,
  loading,
}: {
  data: Account[];
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
  const { permissions } = useAuthorizeStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const { createAccount, exportAccounts, getAccounts } = useAccountsStore();

  /* Debounce search */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAccounts(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, getAccounts]);
  /* eslint-disable-next-line react-hooks/incompatible-library */
  const table = useReactTable<Account>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.MaTK.toString(),
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

  const { Roles, getRoles } = useRolesStore();
  const [createOpen, setCreateOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AccountInput>({
    resolver: zodResolver(AccountInputSchema),
    defaultValues: {
      MaTK: "",
      MaNV: "",
      MaVT: "",
      TenTaiKhoan: "",
      MatKhau: "",
    },
  });

  const onSubmit: SubmitHandler<AccountInput> = async (data) => {
    try {
      await createAccount(data as any);
      setCreateOpen(false);
      reset();
    } catch {
      /* store handles toast */
    }
  };

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  if (loading) {
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Phân Quyền")} page={t("Tài Khoản")} />

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center gap-2">
            <IconSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[160px] pl-9"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => exportAccounts()}
            className="size-9"
            title={t("Xuất Excel")}
          >
            <IconDownload className="h-4 w-4" />
          </Button>

          <TableColumnFilter table={table} />

          {/* Button create */}
          {canCreate(permissions) && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    reset();
                    setCreateOpen(true);
                  }}
                >
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>{t("Tạo Tài Khoản")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để tạo mới.")}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaTk">{t("Mã Tài Khoản")}</Label>
                      <Input
                        id="MaTk"
                        placeholder={t("VD: TK001")}
                        className={`h-10 ${errors.MaTK ? "border-red-500" : ""}`}
                        {...register("MaTK")}
                      />
                      {errors.MaTK && (
                        <p className="text-red-500 text-xs">{t(errors.MaTK.message || "")}</p>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
                      <Input
                        id="MaNV"
                        placeholder={t("VD: NV001")}
                        className={`h-10 ${errors.MaNV ? "border-red-500" : ""}`}
                        {...register("MaNV")}
                      />
                      {errors.MaNV && (
                        <p className="text-red-500 text-xs">{t(errors.MaNV.message || "")}</p>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaVT">{t("Mã Vai Trò")}</Label>
                      <Select
                        value={watch("MaVT")}
                        onValueChange={(value) => setValue("MaVT", value, { shouldValidate: true })}
                      >
                        <SelectTrigger className={`w-full ${errors.MaVT ? "border-red-500" : ""}`}>
                          <SelectValue placeholder={t("Chọn Vai trò")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Roles.map((vt: Role) => (
                              <SelectItem key={vt.MaVT} value={vt.MaVT}>
                                {vt.MaVT} - {vt.TenVaiTro}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.MaVT && (
                        <p className="text-red-500 text-xs">{t(errors.MaVT.message || "")}</p>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TenTaiKhoan">{t("Tên Tài Khoản")}</Label>
                      <Input
                        id="TenTaiKhoan"
                        placeholder={t("VD: nguyenvana")}
                        className={`h-10 ${errors.TenTaiKhoan ? "border-red-500" : ""}`}
                        {...register("TenTaiKhoan")}
                      />
                      {errors.TenTaiKhoan && (
                        <p className="text-red-500 text-xs">{t(errors.TenTaiKhoan.message || "")}</p>
                      )}
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MatKhau">{t("Mật Khẩu")}</Label>
                      <Input
                        id="MatKhau"
                        type="password"
                        className={`h-10 ${errors.MatKhau ? "border-red-500" : ""}`}
                        {...register("MatKhau")}
                      />
                      {errors.MatKhau && (
                        <p className="text-red-500 text-xs">{t(errors.MatKhau.message || "")}</p>
                      )}
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t("Huỷ")}</Button>
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

      {/* Table */}
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
                    colSpan={columns.length}
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
