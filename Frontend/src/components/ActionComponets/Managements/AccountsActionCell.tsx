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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRolesStore } from "@/stores/permissionStores/RolesStore";
import { useEffect } from "react";
import type { Account } from "@/types/authTypes/accountType";
import type { Role } from "@/types/permissionTypes/RolesTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtiles";

export function AccountsActionCell({ acc }: { acc: Account }) {
  const { deleteAccount } = useAccountsStore();
  const { Roles, getRoles } = useRolesStore();
  const { permissions } = useAuthorizeStore();
  useEffect(() => {
    getRoles();
  }, [getRoles]);

  if (!canWrite(permissions)) return null;
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
        {canUpdate(permissions) && (
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Sửa
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Tạo vai trò</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="TenVaiTro">Vai trò</Label>
                    <Select>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Chọn VTXXX" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Roles.map((vt: Role) => (
                            <SelectItem key={vt.MaVT} value={vt.MaVT}>
                              {vt.MaVT} - {vt.TenVaiTro}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="MaTK">Tên Tài Khoản</Label>
                    <Input id="MaTK" name="MaTK" defaultValue="TKXXX" />
                  </Field>
                  <Field>
                    <Label htmlFor="MatKhau">Mật Khẩu</Label>
                    <Input id="MatKhau" name="MatKhau" />
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
        )}
        {canUpdate(permissions) && canDelete(permissions) && (
          <DropdownMenuSeparator />
        )}
        {canDelete(permissions) && (
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
                  <DialogTitle>Xoá Tài Khoản</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="MaTK">
                      Bạn Có muốn xoá tài khoản đã chọn không
                    </Label>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                  </DialogClose>
                  <Button onClick={() => deleteAccount(acc.MaTK)}>Xoá</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
