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
  PermissionSchema,
  type Permission,
} from "@/types/permissionTypes/permissionsTypes";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";

interface CreatePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePermissionDialog({
  open,
  onOpenChange,
}: CreatePermissionDialogProps) {
  const { t } = useTranslation();
  const { createPermissions } = usePermissionsStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Permission>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: { MaQuyen: "", TenQuyen: "" },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<Permission> = async (data) => {
    try {
      await createPermissions(data);
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
            <DialogTitle>{t("Tạo quyền")}</DialogTitle>
            <DialogDescription>
              {t("Hãy nhập thông tin và nhấn Thêm để tạo Quyền")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaQuyen">{t("Mã Quyền")}</Label>
              <Input
                id="MaQuyen"
                placeholder={t("VD: MQ001")}
                className={`h-10 ${errors.MaQuyen ? "border-red-500" : ""}`}
                {...register("MaQuyen")}
              />
              {errors.MaQuyen && (
                <p className="text-red-500 text-xs">{t(errors.MaQuyen.message || "")}</p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="TenQuyen">{t("Tên Quyền")}</Label>
              <Input
                id="TenQuyen"
                placeholder={t("VD: Đọc, Tạo")}
                className={`h-10 ${errors.TenQuyen ? "border-red-500" : ""}`}
                {...register("TenQuyen")}
              />
              {errors.TenQuyen && (
                <p className="text-red-500 text-xs">{t(errors.TenQuyen.message || "")}</p>
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
