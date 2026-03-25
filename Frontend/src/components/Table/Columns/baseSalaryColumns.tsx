import type { BaseSalaryType } from "../Schema/baseSalarySchema";
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

export const columns: ColumnDef<BaseSalaryType>[] = [
  {
    accessorKey: "MaLCB",
    header: () => <div className="w-20 text-center">Mã LCB</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaLCB}</div>
    ),
  },
  {
    accessorKey: "LuongCB",
    header: () => <div className="w-20 text-center">Lương Cơ Bản</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.LuongCB}</div>
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
                  <DialogTitle>Sửa Lương Cơ Bản</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaLCB">Mã Lương Cơ Bản</Label>
                    <Input id="MaLCB" name="MaLCB" defaultValue="LCBxxx" />
                  </Field>
                  <Field>
                    <Label htmlFor="LuongCB">Lương Cơ Bản</Label>
                    <Input id="LuongCB" name="LuongCB" />
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
                  <DialogTitle>Xoá Lương Cơ Bản</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaLCB">Mã Lương Cơ Bản</Label>
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
