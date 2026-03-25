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
import { usePayRollStore } from "@/stores/payRollStores/payRollStores";
import type { PayRoll } from "@/types/payRollTypes/payRollTypes";

export function PayRollActionCell({ payRoll }: { payRoll: PayRoll }) {
    const { deletePayRoll } = usePayRollStore();
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
                    <DialogTitle>Sửa Bảng Lương</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                    <Field>
                        <Label htmlFor="MaLCB">Mã Lương cơ bản</Label>
                        <Input id="MaLCB" name="MaLCB" />
                    </Field>
                    <Field>
                        <Label htmlFor="MaNV">Mã Nhân Viên</Label>
                        <Input id="MaNV" name="MaNV" />
                    </Field>
                    <Field>
                        <Label htmlFor="MaKT">Mã Khấu trừ</Label>
                        <Input id="MaKT" name="MaKT" />
                    </Field>
                    <Field>
                        <Label htmlFor="MaPC">Mã Phụ Cấp</Label>
                        <Input id="MaPC" name="MaPC" />
                    </Field>
                    <Field>
                        <Label htmlFor="MaGL">Mã Giờ Làm</Label>
                        <Input id="MaGL" name="MaGL" />
                    </Field>
                    <Field>
                        <Label htmlFor="Thang">Tháng</Label>
                        <Input id="Thang" name="Thang"/>
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
                    <DialogTitle>Xoá Bảng Lương</DialogTitle>
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
                    <Button onClick={() => deletePayRoll(payRoll.MaLCB)}>
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

