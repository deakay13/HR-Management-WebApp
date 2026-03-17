import type { AccountsType } from "../Schema/AccountsTableSchema";
import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const columns: ColumnDef<AccountsType>[] = [
  {
    accessorKey: "MaTK",
    header: () => <div className="w-20 text-center">Mã Tài Khoản</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaTK}</div>
    ),
  },
  {
    accessorKey: "MaNV",
    header: () => <div className="w-20 text-center">Mã Nhân Viên</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaNV}</div>
    ),
  },
  {
    accessorKey: "MaVT",
    header: () => <div className="w-20 text-center">Mã Vai Trò</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaVT}</div>
    ),
  },
  {
    accessorKey: "TenTaiKhoan",
    header: () => <div className="w-20 text-center">Tên Tài Khoản</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.TenTaiKhoan}</div>
    ),
  },
  {
    accessorKey: "MatKhau",
    header: () => <div className="w-full text-center">Mật khẩu</div>,
    cell: ({ row }) => <div className="w-full">{row.original.MatKhau}</div>,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Sửa
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Tạo vai trò</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaVT">Mã Vai trò</Label>
                    <Input id="MaVT" name="MaVT" defaultValue="VTxxx" />
                  </Field>
                  <Field>
                    <Label htmlFor="TenVaiTro">Tên Vai trò</Label>
                    <Input id="TenVaiTro" name="TenVaiTro" />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
          <DropdownMenuSeparator />
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}>
                  Xoá
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Xoá Vai Trò</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaVT">Mã Vai trò</Label>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                  </DialogClose>
                  <Button type="submit">Xoá</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
