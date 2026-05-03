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
  PayRollInputSchema,
  type PayRollInput,
} from "@/types/payRollTypes/payRollTypes";
import { useCreatePayrollMutation } from "@/hooks/queries/usePayrollQueries";
import { toast } from "sonner";

interface CreatePayRollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePayRollDialog({
  open,
  onOpenChange,
}: CreatePayRollDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: createPayRolls } = useCreatePayrollMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PayRollInput>({
    resolver: zodResolver(PayRollInputSchema),
    defaultValues: {
      MaBL: "",
      MaNV: "",
      MaKT: "",
      MaPC: "",
      MaLCB: "",
      MaGL: "",
      Thang: "",
      SoNgayLam: 26,
    },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<PayRollInput> = async (data) => {
    try {
      await createPayRolls(data as Record<string, unknown>);
      toast.success(t("Tạo bảng lương thành công"));
      onOpenChange(false);
      reset();
    } /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    catch (error: any) {
      toast.error(error.response?.data?.message || t("Tạo mới thất bại"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("Tạo bảng lương")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaBL">{t("Mã Bảng Lương")}</Label>
              <Input
                id="MaBL"
                placeholder={t("BLxxx")}
                className={`h-10 ${errors.MaBL ? "border-red-500" : ""}`}
                {...register("MaBL")}
              />
              {errors.MaBL && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaBL.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
              <Input
                id="MaNV"
                placeholder={t("NVxxx")}
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
              <Label htmlFor="MaKT">{t("Mã Khấu Trừ")}</Label>
              <Input
                id="MaKT"
                placeholder={t("KTxxx")}
                className={`h-10 ${errors.MaKT ? "border-red-500" : ""}`}
                {...register("MaKT")}
              />
              {errors.MaKT && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaKT.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
              <Input
                id="MaPC"
                placeholder={t("PCxxx")}
                className={`h-10 ${errors.MaPC ? "border-red-500" : ""}`}
                {...register("MaPC")}
              />
              {errors.MaPC && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaPC.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaLCB">{t("Mã Lương Cơ Bản")}</Label>
              <Input
                id="MaLCB"
                placeholder={t("LCBxxx")}
                className={`h-10 ${errors.MaLCB ? "border-red-500" : ""}`}
                {...register("MaLCB")}
              />
              {errors.MaLCB && (
                <p className="text-red-500 text-xs">
                  {t(errors.MaLCB.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaGL">{t("Mã Giờ Làm")}</Label>
              <Input
                id="MaGL"
                placeholder={t("GLxxx")}
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
              <Label htmlFor="Thang">{t("Tháng")}</Label>
              <Input
                id="Thang"
                type="month"
                className={`h-10 ${errors.Thang ? "border-red-500" : ""}`}
                {...register("Thang")}
              />
              {errors.Thang && (
                <p className="text-red-500 text-xs">
                  {t(errors.Thang.message || "")}
                </p>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="SoNgayLam">{t("Số ngày công")}</Label>
              <Input
                id="SoNgayLam"
                type="number"
                placeholder="26"
                className={`h-10 ${errors.SoNgayLam ? "border-red-500" : ""}`}
                {...register("SoNgayLam", { valueAsNumber: true })}
              />
              {errors.SoNgayLam && (
                <p className="text-red-500 text-xs">
                  {t(errors.SoNgayLam.message || "")}
                </p>
              )}
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
