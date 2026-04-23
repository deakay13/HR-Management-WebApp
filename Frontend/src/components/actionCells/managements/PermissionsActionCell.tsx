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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PermissionSchema, type PermissionInput } from "@/types/permissionTypes/permissionsTypes";

export function PermissionActionCell({ permis }: { permis: Permission }) {
  const { t } = useTranslation();
  const { deletePermission, updatePermissions } = usePermissionsStore();
  const { permissions } = useAuthorizeStore();

  const [editOpen, setEditOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PermissionInput>({
    resolver: zodResolver(PermissionSchema) as any,
    defaultValues: {
      MaQuyen: permis.MaQuyen,
      TenQuyen: permis.TenQuyen,
    },
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    reset({
      MaQuyen: permis.MaQuyen,
      TenQuyen: permis.TenQuyen,
    });
    setEditOpen(true);
  };

  const onUpdateSubmit = async (data: PermissionInput) => {
    try {
      await updatePermissions(permis.MaQuyen, data);
      setEditOpen(false);
    } catch {
      // Store handles toast
    }
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
        {canUpdate(permissions) && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleOpenEdit();
                }}>
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>{t("Sửa Quyền")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để cập nhật.")}
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="TenQuyen">{t("Tên Quyền")}</Label>
                    <Input
                      id="TenQuyen"
                      placeholder={t("VD: Xem danh sách")}
                      className={`h-10 ${errors.TenQuyen ? "border-red-500" : ""}`}
                      {...register("TenQuyen")}
                    />
                    {errors.TenQuyen && (
                      <p className="text-xs text-red-500">{errors.TenQuyen.message}</p>
                    )}
                  </Field>
                </FieldGroup>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
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
                  onSelect={(e) => e.preventDefault()}>
                  {t("Xoá")}
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>{t("Xoá Quyền")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.")}
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
