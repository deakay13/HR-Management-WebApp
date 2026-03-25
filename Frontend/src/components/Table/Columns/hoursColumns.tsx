import type { HoursType } from "../Schema/hoursSchema";
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

export const columns: ColumnDef<HoursType>[] = [
  {
    accessorKey: "MaGL",
    header: () => <div className="w-20 text-center">Mã Giờ Làm</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaGL}</div>
    ),
  },
  {
    accessorKey: "SoGioLam",
    header: () => <div className="w-20 text-center">Giờ Làm</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.SoGioLam}</div>
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
                  <DialogTitle>Sửa Giờ Làm</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaGL">Mã Giờ Làm</Label>
                    <Input id="MaGL" name="MaGL" defaultValue="GLxxx" />
                  </Field>
                  <Field>
                    <Label htmlFor="SoGioLam">Giờ Làm</Label>
                    <Input id="SoGioLam" name="SoGioLam" />
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
                  <DialogTitle>Xoá Giờ Làm</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaGL">Mã Giờ Làm</Label>
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
