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
import { useDeductionStore } from "@/stores/payRollStores/deductionStores";
import type { Deduction } from "@/types/payRollTypes/deductionTypes";

export function DeductionActionCell({ deduction }: { deduction: Deduction }) {
    const { deleteDeduction } = useDeductionStore();
    return (
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
                    <DialogTitle>Sửa Giảm Trừ</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                    <Field>
                        <Label htmlFor="LoaiKT">Loại Khấu Trừ</Label>
                        <Input id="LoaiKT" name="LoaiKT" />
                    </Field>
                     <Field>
                        <Label htmlFor="PhanTram">Phần trăm</Label>
                        <Input id="PhanTram" name="PhanTram" />
                    </Field>
                    </FieldGroup>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Huỷ</Button>
                    </DialogClose>
                    <Button type="submit">Lưu Thay đổi</Button>
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
                    <Button onClick={() => deleteDeduction(deduction.MaKT)}>
                        Xoá
                    </Button>
                    </DialogFooter>
                </DialogContent>
                </form>
            </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}