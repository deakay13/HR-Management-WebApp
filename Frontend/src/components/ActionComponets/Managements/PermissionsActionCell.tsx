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

export function PermissionActionCell({ permis }: { permis: Permission }) {
    const { deletePermission } = usePermissionsStore();
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
                    <DialogTitle>Sửa Quyền Quyền</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                    <Field>
                        <Label htmlFor="TenVaiTro">Tên Quyền</Label>
                        <Input id="TenVaiTro" name="TenVaiTro" />
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

