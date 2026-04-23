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

import { useDeductionStore } from "@/stores/payRollStores/deductionStore";
import type { Deduction } from "@/types/payRollTypes/deductionTypes";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeductionInputSchema,
  type DeductionInput,
} from "@/types/payRollTypes/deductionTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";
import React from "react";

export function DeductionActionCell({ deduction }: { deduction: Deduction }) {
  const { t } = useTranslation();
  const { deleteDeduction, updateDeduction } = useDeductionStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeductionInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(DeductionInputSchema) as any,
    defaultValues: {
      MaKT: deduction.MaKT,
      LoaiKT: deduction.LoaiKT,
      PhanTram: deduction.PhanTram,
    },
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    reset({
      MaKT: deduction.MaKT,
      LoaiKT: deduction.LoaiKT,
      PhanTram: deduction.PhanTram,
    });
  };

  const onSubmit = async (data: DeductionInput) => {
    await updateDeduction(deduction.MaKT, data);
    setEditOpen(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
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
                  setEditOpen(true);
                }}
              >
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    {t("Sửa Khấu Trừ")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="space-y-4">
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
                    <Label htmlFor="PhanTram">{t("Phần Trăm")} (%)</Label>
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
                  onSelect={(e) => e.preventDefault()}
                >
                  {t("Xoá")}
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>{t("Xoá Khấu Trừ")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t(
                      "Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.",
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{t("Bạn có chắc muốn xoá không?")}</p>
                  <ul>
                    <li>
                      <b>{t("Mã Khấu Trừ")}:</b> {deduction.MaKT}
                    </li>
                    <li>
                      <b>{t("Loại")}:</b> {deduction.LoaiKT}
                    </li>
                    <li>
                      <b>{t("Phần Trăm")}:</b>{" "}
                      <span className="text-red-500 font-semibold">
                        {Number(deduction.PhanTram)}%
                      </span>
                    </li>
                  </ul>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => deleteDeduction(deduction.MaKT)}
                  >
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
