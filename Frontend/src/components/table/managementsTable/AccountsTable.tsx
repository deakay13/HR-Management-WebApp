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

import { columns } from "../columns/managements/AccountsTableColumns";
import type { Account } from "@/types/authTypes/accountTypes";
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
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const { permissions } = useAuthorizeStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const { createAccount, exportAccounts, getAccounts } = useAccountsStore();

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAccounts(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, getAccounts]);
  const table = useReactTable<Account>({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
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
  const [formData, setFormData] = React.useState({
    MaTK: "",
    MaNV: "",
    MaVT: "",
    TenTaiKhoan: "",
    MatKhau: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount(formData);
      setCreateOpen(false);
      setFormData({
        MaTK: "",
        MaNV: "",
        MaVT: "",
        TenTaiKhoan: "",
        MatKhau: "",
      });
    } catch {
      // store handles toast
    }
  };

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  if (loading) {
    return <p className="text-center py-4">{t("Đang tải dữ liệu...")}</p>;
  }

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TableBreadcrumb section={t("Phân Quyền")} page={t("Tài Khoản")} />
        
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => exportAccounts()}
            className="size-9"
            title={t("Xuất Excel")}>
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
                    setFormData({
                      MaTK: "",
                      MaNV: "",
                      MaVT: "",
                      TenTaiKhoan: "",
                      MatKhau: "",
                    });
                    setCreateOpen(true);
                  }}>
                  <IconPlus />
                  <span className="hidden lg:inline">{t("Tạo mới")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        value={formData.MaTK}
                        onChange={(e) =>
                          setFormData({ ...formData, MaTK: e.target.value })
                        }
                      />
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
                      <Input
                        id="MaNV"
                        placeholder={t("VD: NV001")}
                        value={formData.MaNV}
                        onChange={(e) =>
                          setFormData({ ...formData, MaNV: e.target.value })
                        }
                      />
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MaVT">{t("Mã Vai Trò")}</Label>
                      <Select
                        value={formData.MaVT}
                        onValueChange={(value) =>
                          setFormData({ ...formData, MaVT: value })
                        }>
                        <SelectTrigger className="w-full">
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
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="TenTaiKhoan">{t("Tên Tài Khoản")}</Label>
                      <Input
                        id="TenTaiKhoan"
                        placeholder={t("VD: nguyenvana")}
                        value={formData.TenTaiKhoan}
                        onChange={(e) =>
                          setFormData({ ...formData, TenTaiKhoan: e.target.value })
                        }
                      />
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label htmlFor="MatKhau">{t("Mật Khẩu")}</Label>
                      <Input
                        id="MatKhau"
                        type="password"
                        placeholder={t("Nhập mật khẩu")}
                        value={formData.MatKhau}
                        onChange={(e) =>
                          setFormData({ ...formData, MatKhau: e.target.value })
                        }
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t("Huỷ")}</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={
                        !formData.MaTK ||
                        !formData.MaNV ||
                        !formData.MaVT ||
                        !formData.TenTaiKhoan ||
                        !formData.MatKhau
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
        <div className="overflow-hidden rounded-lg border">
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
