import type { AllowanceType } from "../Schema/allowanceSchema";
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

export const columns: ColumnDef<AllowanceType>[] = [
  {
    accessorKey: "MaPC",
    header: () => <div className="w-20 text-center">Mã Phụ Cấp</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.MaPC}</div>
    ),
  },
  {
    accessorKey: "LoaiPC",
    header: () => <div className="w-20 text-center">Loại Phụ Cấp</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.LoaiPC}</div>
    ),
  },
   {
    accessorKey: "SoTien",
    header: () => <div className="w-20 text-center">Số Tiền</div>,
    cell: ({ row }) => (
      <div className="w-20 text-center h-8">{row.original.SoTien}</div>
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
                  <DialogTitle>Tạo phụ cấp</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaPC">Mã Phụ Cấp</Label>
                    <Input id="MaPC" name="MaPC" defaultValue="PCxxx" />
                  </Field>
                  <Field>
                    <Label htmlFor="LoaiPC">Loại Phụ Cấp</Label>
                    <Input id="LoaiPC" name="LoaiPC" />
                  </Field>
                   <Field>
                    <Label htmlFor="SoTien">Số Tiền</Label>
                    <Input id="SoTien" name="SoTien" />
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
                  <DialogTitle>Xoá Phụ Cấp</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaPC">Mã Phụ Cấp</Label>
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
