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
  AllowanceInputSchema,
  type AllowanceInput,
} from "@/types/payRollTypes/allowanceTypes";
import { useCreateAllowanceMutation } from "@/hooks/queries/usePayrollQueries";

interface CreateAllowanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAllowanceDialog({
  open,
  onOpenChange,
}: CreateAllowanceDialogProps) {
  const { t } = useTranslation();
  const createAllowanceMutation = useCreateAllowanceMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AllowanceInput>({
    resolver: zodResolver(AllowanceInputSchema),
    defaultValues: { MaPC: "", LoaiPC: "", SoTien: 0 },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<AllowanceInput> = async (data) => {
    try {
      await createAllowanceMutation.mutateAsync(data as Record<string, unknown>);
      onOpenChange(false);
      reset();
    } catch {
      // hook handles toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("Tạo phụ cấp")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="space-y-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
              <Input
                id="MaPC"
                placeholder={t("VD: PC001")}
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
              <Label htmlFor="LoaiPC">{t("Loại Phụ Cấp")}</Label>
              <Input
                id="LoaiPC"
                placeholder={t("VD: Phụ cấp ăn trưa")}
                className={`h-10 ${errors.LoaiPC ? "border-red-500" : ""}`}
                {...register("LoaiPC")}
              />
              {errors.LoaiPC && (
                <p className="text-red-500 text-xs">
                  {t(errors.LoaiPC.message || "")}
                </p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="SoTien">{t("Số Tiền")}</Label>
              <Input
                id="SoTien"
                type="number"
                placeholder={t("VD: 500000")}
                className={`h-10 ${errors.SoTien ? "border-red-500" : ""}`}
                {...register("SoTien", { valueAsNumber: true })}
              />
              {errors.SoTien && (
                <p className="text-red-500 text-xs">
                  {t(errors.SoTien.message || "")}
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
