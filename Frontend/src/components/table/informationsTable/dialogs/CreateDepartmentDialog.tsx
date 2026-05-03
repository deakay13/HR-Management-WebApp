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
import type { Department } from "@/types/informationTypes/departmentTypes";
import { getDepartmentValidationSchema } from "@/types/informationTypes/departmentTypes";
import { useCreateDepartmentMutation } from "@/hooks/queries/useDepartmentsQuery";

interface CreateDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingDepartmentIds: string[];
}

export function CreateDepartmentDialog({
  open,
  onOpenChange,
  existingDepartmentIds,
}: CreateDepartmentDialogProps) {
  const { t } = useTranslation();
  const createDepartmentMutation = useCreateDepartmentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Department>({
    resolver: zodResolver(getDepartmentValidationSchema(existingDepartmentIds)),
    defaultValues: {
      MaPB: "",
      TenPB: "",
    },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<Department> = async (formData) => {
    try {
      await createDepartmentMutation.mutateAsync(formData);
      onOpenChange(false);
      reset();
    } catch {
      // Error handled in store toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("Tạo Phòng Ban Mới")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("Nhập thông tin chi tiết để tạo mới.")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaPB">{t("Mã Phòng Ban")}</Label>
              <Input
                id="MaPB"
                placeholder={t("VD: PB001")}
                className={`h-10 ${errors.MaPB ? "border-red-500" : ""}`}
                {...register("MaPB")}
              />
              {errors.MaPB && (
                <p className="text-red-500 text-xs">{t(errors.MaPB.message || "")}</p>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="TenPB">{t("Tên Phòng Ban")}</Label>
              <Input
                id="TenPB"
                placeholder={t("Nhập tên phòng ban")}
                className={`h-10 ${errors.TenPB ? "border-red-500" : ""}`}
                {...register("TenPB")}
              />
              {errors.TenPB && (
                <p className="text-red-500 text-xs">{t(errors.TenPB.message || "")}</p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("Huỷ")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {t("Tạo mới")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
