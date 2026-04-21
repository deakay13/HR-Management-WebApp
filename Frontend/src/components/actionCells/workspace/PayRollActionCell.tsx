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

import { usePayRollStore } from "@/stores/payRollStores/payRollStore";
import type { PayRoll } from "@/types/payRollTypes/payRollTypes";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PayRollInputSchema,
  type PayRollInput,
} from "@/types/payRollTypes/payRollTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function PayRollActionCell({ payRoll }: { payRoll: PayRoll }) {
  const { t } = useTranslation();
  const { deletePayRoll, updatePayRoll } = usePayRollStore();
  const { permissions } = useAuthorizeStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PayRollInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PayRollInputSchema) as any,
    defaultValues: {
      MaBL: payRoll.MaBL,
      MaNV: payRoll.MaNV,
      MaLCB: payRoll.MaLCB,
      MaPC: payRoll.MaPC,
      MaKT: payRoll.MaKT,
      MaGL: payRoll.MaGL,
      Thang: payRoll.Thang,
      SoNgayLam: Number(payRoll.SoNgayLam || 26),
    },
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    reset({
      MaBL: payRoll.MaBL,
      MaNV: payRoll.MaNV,
      MaLCB: payRoll.MaLCB,
      MaPC: payRoll.MaPC,
      MaKT: payRoll.MaKT,
      MaGL: payRoll.MaGL,
      Thang: payRoll.Thang,
      SoNgayLam: Number(payRoll.SoNgayLam || 26),
    });
  };

  const onSubmit = async (data: PayRollInput) => {
    await updatePayRoll(payRoll.MaBL, data);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon">
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        {canUpdate(permissions) && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleOpenEdit();
                }}>
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    {t("Sửa Bảng Lương")}
                  </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Nhập thông tin chi tiết để cập nhật.")}
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Mã Lương Cơ Bản")}</Label>
                    <Input {...register("MaLCB")} />
                    {errors.MaLCB && (
                      <p className="text-red-500 text-sm">{errors.MaLCB.message}</p>
                    )}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Mã Nhân Viên")}</Label>
                    <Input {...register("MaNV")} />
                    {errors.MaNV && (
                      <p className="text-red-500 text-sm">{errors.MaNV.message}</p>
                    )}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Mã Khấu Trừ")}</Label>
                    <Input {...register("MaKT")} />
                    {errors.MaKT && (
                      <p className="text-red-500 text-sm">{errors.MaKT.message}</p>
                    )}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Mã Phụ Cấp")}</Label>
                    <Input {...register("MaPC")} />
                    {errors.MaPC && (
                      <p className="text-red-500 text-sm">{errors.MaPC.message}</p>
                    )}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Mã Giờ Làm")}</Label>
                    <Input {...register("MaGL")} />
                    {errors.MaGL && (
                      <p className="text-red-500 text-sm">{errors.MaGL.message}</p>
                    )}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Tháng")}</Label>
                    <Input type="month" {...register("Thang")} />
                    {errors.Thang && (
                      <p className="text-red-500 text-sm">{errors.Thang.message}</p>
                    )}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Số ngày công")}</Label>
                    <Input 
                      type="number" 
                      {...register("SoNgayLam", { valueAsNumber: true })} 
                    />
                    {errors.SoNgayLam && (
                      <p className="text-red-500 text-sm">{errors.SoNgayLam.message}</p>
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
                    {t("Tính lại lương")}
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
            <DialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}>
                {t("Xoá")}
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>{t("Xoá Bảng Lương")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {t("Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.")}
                    </DialogDescription>
              </DialogHeader>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>{t("Bạn có chắc muốn xoá không?")}</p>
                <ul>
                  <li><b>{t("Mã Bảng Lương")}:</b> {payRoll.MaBL}</li>
                  <li><b>{t("Mã Nhân Viên")}:</b> {payRoll.MaNV}</li>
                  <li><b>{t("Mã Lương Cơ Bản")}:</b> {payRoll.MaLCB}</li>
                  <li><b>{t("Mã Phụ Cấp")}:</b> {payRoll.MaPC}</li>
                  <li><b>{t("Mã Khấu Trừ")}:</b> {payRoll.MaKT}</li>
                  <li><b>{t("Mã Giờ Làm")}:</b> {payRoll.MaGL}</li>
                  <li>
                    <b>{t("Tháng Trong Năm")}:</b>{" "}
                    <span className="font-semibold text-red-500">{payRoll.Thang}</span>
                  </li>
                </ul>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("Huỷ")}</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => deletePayRoll(payRoll.MaBL)}>
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
