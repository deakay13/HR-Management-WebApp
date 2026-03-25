import type { DeductionType } from "../Schema/deductionSchema";
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

export const columns: ColumnDef<DeductionType>[] = [
  {
    accessorKey: "MaKT",
    header: () => <div className="w-20 text-center">Mã Khấu Trừ</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaKT}</div>
    ),
  },
  {
    accessorKey: "LoaiKT",
    header: () => <div className="w-20 text-center">Loại Khấu Trừ</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.LoaiKT}</div>
    ),
  },
    {
    accessorKey: "PhanTram",
    header: () => <div className="w-20 text-center">Phần Trăm</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.PhanTram}</div>
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
                  <DialogTitle>Sửa Khấu Trừ</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaKT">Mã Khấu Trừ</Label>
                    <Input id="MaKT" name="MaKT" defaultValue="KTxxx" />
                  </Field>
                  <Field>
                    <Label htmlFor="LoaiKT">Loại Khấu Trừ</Label>
                    <Input id="LoaiKT" name="LoaiKT" />
                  </Field>
                   <Field>
                    <Label htmlFor="PhanTram">Phần Trăm</Label>
                    <Input id="PhanTram" name="PhanTram" />
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
                    <Label htmlFor="MaKT">Mã Khấu Trừ</Label>
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
