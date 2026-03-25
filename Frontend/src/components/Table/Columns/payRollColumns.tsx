import type { PayRollType } from "../Schema/payRollSchema";
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
import { Label } from "@/components/ui/label";

export const columns: ColumnDef<PayRollType>[] = [
  {
    accessorKey: "MaBL",
    header: () => <div className="w-20 text-center">Mã BL</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaBL}</div>
    ),
  },
  {
    accessorKey: "MaNV",
    header: () => <div className="w-20 text-center">Mã NV</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaNV}</div>
    ),
  },
  {
    accessorKey: "MaLCB",
    header: () => <div className="w-20 text-center">Mã LCB</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaLCB}</div>
    ),
  },
  {
    accessorKey: "MaPC",
    header: () => <div className="w-20 text-center">Mã Phụ Cấp</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaPC}</div>
    ),
  },
  {
    accessorKey: "MaKT",
    header: () => <div className="w-20 text-center">Mã Khấu Trừ</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaKT}</div>
    ),
  },
  {
    accessorKey: "MaGL",
    header: () => <div className="w-20 text-center">Mã Giờ Làm </div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaGL}</div>
    ),
  },
  {
    accessorKey: "Thang",
    header: () => <div className="w-20 text-center">Tháng</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.Thang}</div>
    ),
  },
  {
    accessorKey: "TongLuong",
    header: () => <div className="w-20 text-center">Tổng Lương</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.TongLuong}</div>
    ),
  },
  {
    accessorKey: "NgayTinhLuong",
    header: () => <div className="w-20 text-center">Ngày Tính </div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.NgayTinhLuong}</div>
    ),
  },
    {
    accessorKey: "TrangThai",
    header: () => <div className="w-20 text-center">Trạng Thái</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.TrangThai}</div>
    ),
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
                  <DialogTitle>Sửa Bảng Lương</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaBL">Mã Bảng Lương</Label>
                    <Input id="MaBL" name="MaBL" defaultValue="BLxxx" />
                  </Field>
                  <Field>
                    <Label htmlFor="MaNV">Mã Nhân Viên</Label>
                    <Input id="MaNV" name="MaNV" />
                  </Field>
                   <Field>
                    <Label htmlFor="MaLCB">Mã Lương Cơ Bản</Label>
                    <Input id="MaLCB" name="MaLCB" />
                  </Field>
                 <Field>
                    <Label htmlFor="MaPC">Mã Phụ Cấp</Label>
                    <Input id="MaPC" name="MaPC" />
                  </Field>
                   <Field>
                    <Label htmlFor="MaKT">Mã Khấu Trừ</Label>
                    <Input id="MaKT" name="MaKT" />
                  </Field>
                   <Field>
                    <Label htmlFor="MaGL">Mã Giờ Làm</Label>
                    <Input id="MaGL" name="MaGL" />
                  </Field>
                   <Field>
                    <Label htmlFor="Thang">Tháng</Label>
                    <Input id="Thang" name="Thang" />
                  </Field>
                     <Field>
                    <Label htmlFor="NgayTinhLuong">Ngày Tính Lương</Label>
                    <Input id="NgayTinhLuong" name="NgayTinhLuong" />
                  </Field>
                   <Field>
                    <Label htmlFor="TrangThai">Trạng Thái</Label>
                    <Input id="TrangThai" name="TrangThai" />
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
                  <DialogTitle>Xoá Khấu Trừ</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaKT">Mã Bảng Lương</Label>
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
