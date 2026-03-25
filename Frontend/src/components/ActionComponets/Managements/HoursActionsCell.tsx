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
import { useHoursStore } from "@/stores/payRollStores/hoursStores";
import type { Hours } from "@/types/payRollTypes/hoursTypes";

export function HoursActionCell({ hours }: { hours: Hours }) {
    const { deleteHours } = useHoursStore();
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
                    <DialogTitle>Sửa Phụ Cấp</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                    <Field>
                        <Label htmlFor="SoGioLam">Giờ làm</Label>
                        <Input id="SoGioLam" name="SoGioLam" />
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
                    <Button onClick={() => deleteHours(hours.MaGL)}>
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

