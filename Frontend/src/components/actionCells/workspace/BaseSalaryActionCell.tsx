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

import { useUpdateBaseSalaryMutation, useDeleteBaseSalaryMutation } from "@/hooks/queries/usePayrollQueries";
import { toast } from "sonner";
import type { BaseSalary } from "@/types/payRollTypes/baseSalaryTypes";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaseSalaryInputSchema,
  type BaseSalaryInput,
} from "@/types/payRollTypes/baseSalaryTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";
import React from "react";

export function BaseSalaryActionCell({
  baseSalary,
}: {
  baseSalary: BaseSalary;
}) {
  const { t } = useTranslation();
  const { mutateAsync: updateBaseSalary } = useUpdateBaseSalaryMutation();
  const { mutateAsync: deleteBaseSalary } = useDeleteBaseSalaryMutation();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BaseSalaryInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver type mismatch với useForm generic
    resolver: zodResolver(BaseSalaryInputSchema) as any,
    defaultValues: {
      MaLCB: baseSalary.MaLCB,
      LuongCB: baseSalary.LuongCB,
    },
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    reset({
      MaLCB: baseSalary.MaLCB,
      LuongCB: baseSalary.LuongCB,
    });
  };

  const onSubmit = async (data: BaseSalaryInput) => {
    try {
      await updateBaseSalary({ id: baseSalary.MaLCB, data: data as Record<string, unknown> });
      toast.success(t("Sửa lương cơ bản thành công"));
      setEditOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t("Sửa lương cơ bản thất bại"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBaseSalary(baseSalary.MaLCB);
      toast.success(t("Xoá lương cơ bản thành công"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t("Xoá lương cơ bản thất bại"));
    }
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
        {/* UPDATE */}
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
                    {t("Sửa Lương Cơ Bản")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="LuongCB">{t("Lương Cơ Bản")}</Label>
                    <Input
                      id="LuongCB"
                      type="number"
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

        {/* DELETE */}
        {canDelete(permissions) && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                {t("Xoá")}
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t("Xoá Lương Cơ Bản")}</DialogTitle>
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
                    <b>{t("Mã")}:</b> {baseSalary.MaLCB}
                  </li>
                  <li>
                    <b>{t("Lương")}:</b>{" "}
                    {Number(baseSalary.LuongCB).toLocaleString()} VNĐ
                  </li>
                </ul>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("Huỷ")}</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  {t("Xoá")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
