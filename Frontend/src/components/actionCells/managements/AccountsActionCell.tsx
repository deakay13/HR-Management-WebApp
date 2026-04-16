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
  DialogDescription,
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
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useEffect, useState } from "react";
import type { Account } from "@/types/authTypes/accountTypes";
import type { Role } from "@/types/permissionTypes/rolesTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function AccountsActionCell({ acc }: { acc: Account }) {
  const { t } = useTranslation();
  const { updateAccount, deleteAccount } = useAccountsStore();
  const { Roles, getRoles } = useRolesStore();
  const { permissions } = useAuthorizeStore();

  const [editOpen, setEditOpen] = useState(false);
  const [editTenTK, setEditTenTK] = useState(acc.TenTaiKhoan);
  const [editMaVT, setEditMaVT] = useState(acc.MaVT);
  const [editMatKhau, setEditMatKhau] = useState("");

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  useEffect(() => {
    if (editOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditTenTK(acc.TenTaiKhoan);
      setEditMaVT(acc.MaVT);
      setEditMatKhau("");
    }
  }, [editOpen, acc.TenTaiKhoan, acc.MaVT]);

  const handleUpdate = async () => {
    const data: Partial<Account> = {};
    if (editTenTK !== acc.TenTaiKhoan) data.TenTaiKhoan = editTenTK;
    if (editMaVT !== acc.MaVT) data.MaVT = editMaVT;
    if (editMatKhau) data.MatKhau = editMatKhau;
    if (Object.keys(data).length === 0) {
      setEditOpen(false);
      return;
    }
    try {
      await updateAccount(acc.MaTK, data);
      setEditOpen(false);
    } catch {
      // keep dialog open on error
    }
  };

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
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t("Sửa Tài Khoản")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để cập nhật.")}
                    </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label>{t("Vai Trò")}</Label>
                  <Select value={editMaVT} onValueChange={setEditMaVT}>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder={t("Chọn vai trò")} />
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
                  <Label>{t("Tên Tài Khoản")}</Label>
                  <Input
                    value={editTenTK}
                    onChange={(e) => setEditTenTK(e.target.value)}
                  />
                </Field>
                <Field>
                  <Label>{t("Mật Khẩu")}</Label>
                  <Input
                    type="password"
                    placeholder={t("Để trống nếu không đổi")}
                    value={editMatKhau}
                    onChange={(e) => setEditMatKhau(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("Huỷ")}</Button>
                </DialogClose>
                <Button onClick={handleUpdate}>{t("Lưu thay đổi")}</Button>
              </DialogFooter>
            </DialogContent>
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
                  {t("Xoá")}
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>{t("Xoá Tài Khoản")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.")}
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label>{t("Bạn có chắc muốn xoá tài khoản đã chọn?")}</Label>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button onClick={() => deleteAccount(acc.MaTK)}>
                    {t("Xoá")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
