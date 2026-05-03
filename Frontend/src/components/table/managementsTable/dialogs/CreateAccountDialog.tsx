import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AccountInputSchema,
  type AccountInput,
} from "@/types/authTypes/accountTypes";
import type { Role } from "@/types/permissionTypes/rolesTypes";

import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAccountDialog({
  open,
  onOpenChange,
}: CreateAccountDialogProps) {
  const { t } = useTranslation();
  const { createAccount } = useAccountsStore();
  const { Roles } = useRolesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AccountInput>({
    resolver: zodResolver(AccountInputSchema),
    defaultValues: {
      MaTK: "",
      MaNV: "",
      MaVT: "",
      TenTaiKhoan: "",
      MatKhau: "",
    },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<AccountInput> = async (data) => {
    try {
      await createAccount(data);
      onOpenChange(false);
      reset();
    } catch {
      /* store handles toast */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>{t("Tạo Tài Khoản")}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaTk">{t("Mã Tài Khoản")}</Label>
              <Input
                id="MaTk"
                placeholder={t("VD: TK001")}
                className={`h-10 ${errors.MaTK ? "border-red-500" : ""}`}
                {...register("MaTK")}
              />
              {errors.MaTK && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaTK.message || "")}
                </p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
              <Input
                id="MaNV"
                placeholder={t("VD: NV001")}
                className={`h-10 ${errors.MaNV ? "border-red-500" : ""}`}
                {...register("MaNV")}
              />
              {errors.MaNV && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaNV.message || "")}
                </p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaVT">{t("Mã Vai Trò")}</Label>
              <Select
                value={watch("MaVT")}
                onValueChange={(value) =>
                  setValue("MaVT", value, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  className={`w-full ${errors.MaVT ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder={t("Chọn Vai trò")} />
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
              {errors.MaVT && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaVT.message || "")}
                </p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="TenTaiKhoan">{t("Tên Tài Khoản")}</Label>
              <Input
                id="TenTaiKhoan"
                placeholder={t("VD: nguyenvana")}
                className={`h-10 ${errors.TenTaiKhoan ? "border-red-500" : ""}`}
                {...register("TenTaiKhoan")}
              />
              {errors.TenTaiKhoan && (
                <p className="text-red-500 text-xs">
                  {t(errors.TenTaiKhoan.message || "")}
                </p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MatKhau">{t("Mật Khẩu")}</Label>
              <Input
                id="MatKhau"
                type="password"
                className={`h-10 ${errors.MatKhau ? "border-red-500" : ""}`}
                {...register("MatKhau")}
              />
              {errors.MatKhau && (
                <p className="text-red-500 text-xs">
                  {t(errors.MatKhau.message || "")}
                </p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">{t("Huỷ")}</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {t("Tạo mới")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
