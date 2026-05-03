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
  DeductionInputSchema,
  type DeductionInput,
} from "@/types/payRollTypes/deductionTypes";
import { useCreateDeductionMutation } from "@/hooks/queries/usePayrollQueries";
import { toast } from "sonner";

interface CreateDeductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDeductionDialog({
  open,
  onOpenChange,
}: CreateDeductionDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: createDeduction } = useCreateDeductionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeductionInput>({
    resolver: zodResolver(DeductionInputSchema),
    defaultValues: { MaKT: "", LoaiKT: "", PhanTram: 0 },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<DeductionInput> = async (data) => {
    try {
      await createDeduction(data as Record<string, unknown>);
      toast.success(t("Tạo khấu trừ thành công"));
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
              {t("Tạo khấu trừ")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="space-y-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaKT">{t("Mã Khấu Trừ")}</Label>
              <Input
                id="MaKT"
                placeholder={t("VD: KT001")}
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
              <Label htmlFor="LoaiKT">{t("Loại Khấu Trừ")}</Label>
              <Input
                id="LoaiKT"
                placeholder={t("VD: Thuế TNCN")}
                className={`h-10 ${errors.LoaiKT ? "border-red-500" : ""}`}
                {...register("LoaiKT")}
              />
              {errors.LoaiKT && (
                <p className="text-red-500 text-xs">
                  {t(errors.LoaiKT.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="PhanTram">{t("Phần Trăm (%)")}</Label>
              <Input
                id="PhanTram"
                type="number"
                placeholder={t("VD: 10")}
                className={`h-10 ${errors.PhanTram ? "border-red-500" : ""}`}
                {...register("PhanTram", { valueAsNumber: true })}
              />
              {errors.PhanTram && (
                <p className="text-red-500 text-xs">
                  {t(errors.PhanTram.message || "")}
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
