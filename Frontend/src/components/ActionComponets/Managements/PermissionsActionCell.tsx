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
import { usePermissionsStore } from "@/stores/permissionStores/PermissionsStore";
import type { Permission } from "@/types/permissionTypes/PermissionsTypes";
import React from "react";

export function PermissionActionCell({ permis }: { permis: Permission }) {
    const { deletePermission, updatePermissions } = usePermissionsStore();
    const [formData, setFormData] = React.useState({
        TenQuyen: permis.TenQuyen,
    });
    
    //  RESET DATA
    const handleOpenEdit = () => {
        setFormData({
            TenQuyen: permis.TenQuyen,
        });
    };

    //  HANDLE UPDATE
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await updatePermissions(permis.MaQuyen, {
            MaQuyen: permis.MaQuyen,
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
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleOpenEdit(); }}>
                        Sửa
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Sửa Quyền</DialogTitle>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="TenVaiTro">Tên Quyền</Label>
                                    <Input id="TenVaiTro" name="TenVaiTro"
                                        value={formData.TenQuyen}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                TenQuyen: e.target.value,
                                            })
                                        }
                                    />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Huỷ</Button>
                            </DialogClose>
                                <Button type="submit"disabled={!formData.TenQuyen}>Lưu Thay đổi</Button>
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
                    <Button onClick={() => deletePermission(permis.MaQuyen)}>
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

