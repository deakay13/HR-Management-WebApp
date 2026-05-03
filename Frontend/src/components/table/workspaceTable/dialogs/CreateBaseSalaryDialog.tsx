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
  BaseSalaryInputSchema,
  type BaseSalaryInput,
} from "@/types/payRollTypes/baseSalaryTypes";
import { useCreateBaseSalaryMutation } from "@/hooks/queries/usePayrollQueries";
import { toast } from "sonner";

interface CreateBaseSalaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBaseSalaryDialog({
  open,
  onOpenChange,
}: CreateBaseSalaryDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: createBaseSalary } = useCreateBaseSalaryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BaseSalaryInput>({
    resolver: zodResolver(BaseSalaryInputSchema),
    defaultValues: { MaLCB: "", LuongCB: 0 },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<BaseSalaryInput> = async (data) => {
    try {
      await createBaseSalary(data as Record<string, unknown>);
      toast.success(t("Tạo lương cơ bản thành công"));
      onOpenChange(false);
      reset();
    } /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    catch (error: any) {
      const message = error.response?.data?.message || t("Tạo mới thất bại");
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("Tạo lương cơ bản")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaLCB">{t("Mã Lương Cơ Bản")}</Label>
              <Input
                id="MaLCB"
                placeholder={t("VD: LCB001")}
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
              <Label htmlFor="LuongCB">{t("Lương Cơ Bản")}</Label>
              <Input
                id="LuongCB"
                type="number"
                placeholder={t("VD: 5000000")}
                className={`h-10 ${errors.LuongCB ? "border-red-500" : ""}`}
                {...register("LuongCB", { valueAsNumber: true })}
              />
              {errors.LuongCB && (
                <p className="text-red-500 text-xs">
                  {t(errors.LuongCB.message || "")}
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
