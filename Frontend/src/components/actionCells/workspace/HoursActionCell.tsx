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

import { useHoursStore } from "@/stores/payRollStores/hoursStore";
import type { Hours } from "@/types/payRollTypes/hoursTypes";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HoursInputSchema,
  type HoursInput,
} from "@/types/payRollTypes/hoursTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";
import React from "react";

export function HoursActionCell({ hours }: { hours: Hours }) {
  const { t } = useTranslation();
  const { deleteHours, updateHours } = useHoursStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HoursInput>({
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    resolver: zodResolver(HoursInputSchema) as any,
    defaultValues: {
      MaGL: hours.MaGL,
      SoGioLam: hours.SoGioLam,
      SoNgayLam: hours.SoNgayLam || 26,
      TongSoGio: hours.TongSoGio || Number(hours.SoGioLam) * 26,
    },
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    reset({
      MaGL: hours.MaGL,
      SoGioLam: hours.SoGioLam,
      SoNgayLam: hours.SoNgayLam,
      TongSoGio: hours.TongSoGio,
    });
  };

  const onSubmit = async (data: HoursInput) => {
    await updateHours(hours.MaGL, data);
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

            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    {t("Sửa ca làm việc")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="SoGioLam">{t("Số Giờ/Ngày")}</Label>
                    <Input
                      id="SoGioLam"
                      type="number"
                      className="h-10"
                      placeholder={t("VD: 8")}
                      {...register("SoGioLam")}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setValue("SoGioLam", val);
                        /* eslint-disable-next-line react-hooks/incompatible-library */
                        setValue("TongSoGio", val * Number(watch("SoNgayLam")));
                      }}
                    />
                    {errors.SoGioLam && (
                      <p className="text-red-500 text-sm">
                        {errors.SoGioLam.message}
                      </p>
                    )}
                  </Field>

                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="SoNgayLam">{t("Số Ngày Công Chuẩn")}</Label>
                    <Input
                      id="SoNgayLam"
                      type="number"
                      placeholder="26"
                      className="h-10"
                      {...register("SoNgayLam")}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setValue("SoNgayLam", val);
                        setValue("TongSoGio", Number(watch("SoGioLam")) * val);
                      }}
                    />
                    {errors.SoNgayLam && (
                      <p className="text-red-500 text-sm">
                        {errors.SoNgayLam.message}
                      </p>
                    )}
                  </Field>

                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="TongSoGio">
                      {t("Tổng Giờ Chuẩn/Tháng")}
                    </Label>
                    <Input
                      id="TongSoGio"
                      type="number"
                      className="h-10 bg-muted"
                      readOnly
                      {...register("TongSoGio")}
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

            <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("Xoá ca làm việc")}</DialogTitle>
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
                    <b>{t("Mã Ca Làm")}:</b> {hours.MaGL}
                  </li>
                  <li>
                    <b>{t("Số giờ")}:</b>{" "}
                    <span className="text-red-500 font-semibold">
                      {Number(hours.SoGioLam)} {t("giờ")}
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
                  onClick={() => deleteHours(hours.MaGL)}
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
