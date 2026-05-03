import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RoleInputSchema,
  type RoleInput,
} from "@/types/permissionTypes/rolesTypes";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
}: CreateRoleDialogProps) {
  const { t } = useTranslation();
  const { createRoles } = useRolesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleInput>({
    resolver: zodResolver(RoleInputSchema),
    defaultValues: { MaVT: "", TenVaiTro: "" },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<RoleInput> = async (data) => {
    try {
      await createRoles(data);
      onOpenChange(false);
      reset();
    } catch {
      // toast is handled in store
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>{t("Tạo vai trò")}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaVT">{t("Mã Vai Trò")}</Label>
              <Input
                id="MaVT"
                placeholder={t("VD: VT001")}
                className={`h-10 ${errors.MaVT ? "border-red-500" : ""}`}
                {...register("MaVT")}
              />
              {errors.MaVT && (
                <p className="text-red-500 text-xs">{t(errors.MaVT.message || "")}</p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="TenVaiTro">{t("Tên Vai Trò")}</Label>
              <Input
                id="TenVaiTro"
                placeholder={t("VD: Quản trị viên")}
                className={`h-10 ${errors.TenVaiTro ? "border-red-500" : ""}`}
                {...register("TenVaiTro")}
              />
              {errors.TenVaiTro && (
                <p className="text-red-500 text-xs">{t(errors.TenVaiTro.message || "")}</p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">{t("Huỷ")}</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {t("Thêm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
