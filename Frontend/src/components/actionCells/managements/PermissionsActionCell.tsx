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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import type { Permission } from "@/types/permissionTypes/permissionsTypes";
import React from "react";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function PermissionActionCell({ permis }: { permis: Permission }) {
  const { t } = useTranslation();
  const { deletePermission, updatePermissions } = usePermissionsStore();
  const { permissions } = useAuthorizeStore();

  const [formData, setFormData] = React.useState({
    TenQuyen: permis.TenQuyen,
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    setFormData({ TenQuyen: permis.TenQuyen });
  };

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
          size="icon"
        >
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {canUpdate(permissions) && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleOpenEdit();
                }}
              >
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <form onSubmit={handleUpdate} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>{t("Sửa Quyền")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="TenQuyen">{t("Tên Quyền")}</Label>
                    <Input
                      id="TenQuyen"
                      name="TenQuyen"
                      value={formData.TenQuyen}
                      onChange={(e) =>
                        setFormData({ ...formData, TenQuyen: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button type="submit" disabled={!formData.TenQuyen}>
                    {t("Lưu thay đổi")}
                  </Button>
                </DialogFooter>
              </form>
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
                  onSelect={(e) => e.preventDefault()}
                >
                  {t("Xoá")}
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>{t("Xoá Quyền")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t(
                      "Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.",
                    )}
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label>
                      {t("Bạn có chắc muốn xoá quyền")}{" "}
                      <strong>{permis.TenQuyen}</strong>?
                    </Label>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button onClick={() => deletePermission(permis.MaQuyen)}>
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
