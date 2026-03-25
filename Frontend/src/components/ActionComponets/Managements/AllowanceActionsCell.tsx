import * as React from "react";
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
import { useAllowanceStore } from "@/stores/payRollStores/allowanceStores";
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";

export function AllowanceActionCell({ allowance }: { allowance: Allowance }) {
    const { deleteAllowance, updateAllowance } = useAllowanceStore();
     //  STATE
        const [formData, setFormData] = React.useState({
            LoaiPC: allowance.LoaiPC,
            SoTien: allowance.SoTien,
        });

        //  RESET DATA KHI MỞ DIALOG
        const handleOpenEdit = () => {
            setFormData({
            LoaiPC: allowance.LoaiPC,
            SoTien: allowance.SoTien,
            });
        };

        //  HANDLE UPDATE
        const handleUpdate = async (e: React.FormEvent) => {
            e.preventDefault();

            await updateAllowance(allowance.MaPC, {
            MaPC: allowance.MaPC,
            ...formData,
            });
        };
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
            <DialogTrigger asChild>
                <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    handleOpenEdit();
                }}
                >
                Sửa
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
            <form onSubmit={handleUpdate} className="space-y-6">
                <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                    Sửa Phụ Cấp
                </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                {/* LoaiPC */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="LoaiPC">Loại Phụ Cấp</Label>
                    <Input
                    id="LoaiPC"
                    className="h-10"
                    value={formData.LoaiPC}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        LoaiPC: e.target.value,
                        })
                    }
                    />
                </div>
                {/* SoTien */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="SoTien">Số tiền</Label>
                    <Input
                    id="SoTien"
                    type="number"
                    className="h-10"
                    value={formData.SoTien}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        SoTien: Number(e.target.value),
                        })
                    }
                    />
                </div>
                </div>
                <DialogFooter className="gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Huỷ
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={!formData.LoaiPC || formData.SoTien <= 0}
                >
                    Lưu Thay đổi
                </Button>
                </DialogFooter>
            </form>
            </DialogContent>
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
                    <Button onClick={() => deleteAllowance(allowance.MaPC)}>
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

