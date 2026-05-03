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
  HoursInputSchema,
  type HoursInput,
} from "@/types/payRollTypes/hoursTypes";
import { useCreateHourMutation } from "@/hooks/queries/usePayrollQueries";
import { toast } from "sonner";

interface CreateHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHoursDialog({
  open,
  onOpenChange,
}: CreateHoursDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: createHours } = useCreateHourMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<HoursInput>({
    resolver: zodResolver(HoursInputSchema),
    defaultValues: { MaGL: "", SoGioLam: 0, SoNgayLam: 26, TongSoGio: 0 },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<HoursInput> = async (data) => {
    try {
      await createHours(data as Record<string, unknown>);
      toast.success(t("Tạo ca làm việc thành công"));
      onOpenChange(false);
      reset();
    } /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    catch (error: any) {
      toast.error(error.response?.data?.message || t("Tạo mới thất bại"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("Tạo ca làm việc")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="space-y-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaGL">{t("Mã Giờ Làm")}</Label>
              <Input
                id="MaGL"
                placeholder={t("VD: GL001")}
                className={`h-10 ${errors.MaGL ? "border-red-500" : ""}`}
                {...register("MaGL")}
              />
              {errors.MaGL && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaGL.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="SoGioLam">{t("Số Giờ Làm/Ngày")}</Label>
              <Input
                id="SoGioLam"
                type="number"
                placeholder={t("VD: 8")}
                className={`h-10 ${errors.SoGioLam ? "border-red-500" : ""}`}
                {...register("SoGioLam", { valueAsNumber: true })}
              />
              {errors.SoGioLam && (
                <p className="text-red-500 text-xs">
                  {t(errors.SoGioLam.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="SoNgayLam">
                {t("Số Ngày Công Bảng Lương (Chuẩn)")}
              </Label>
              <Input
                id="SoNgayLam"
                type="number"
                placeholder={t("VD: 26")}
                className={`h-10 ${errors.SoNgayLam ? "border-red-500" : ""}`}
                {...register("SoNgayLam", { valueAsNumber: true })}
              />
              {errors.SoNgayLam && (
                <p className="text-red-500 text-xs">
                  {t(errors.SoNgayLam.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="TongSoGio">{t("Tổng Giờ Công/Tháng")}</Label>
              <Input
                id="TongSoGio"
                type="number"
                className="h-10 bg-muted"
                value={(watch("SoGioLam") || 0) * (watch("SoNgayLam") || 0)}
                disabled
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("Huỷ")}
              </Button>
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
