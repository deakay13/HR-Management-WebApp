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
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { usePayRollStore } from "@/stores/payRollStores/payRollStores";
import type { PayRoll } from "@/types/payRollTypes/payRollTypes";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PayRollInputSchema,
  type PayRollInput,
} from "@/types/payRollTypes/payRollTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtiles";

export function PayRollActionCell({ payRoll }: { payRoll: PayRoll }) {
  const { deletePayRoll, updatePayRoll } = usePayRollStore();
  const { permissions } = useAuthorizeStore();

  if (!canWrite(permissions)) return null;

  //  react-hook-form + zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PayRollInput>({
    resolver: zodResolver(PayRollInputSchema) as any,
    defaultValues: {
      MaBL: payRoll.MaBL,
      MaNV: payRoll.MaNV,
      MaLCB: payRoll.MaLCB,
      MaPC: payRoll.MaPC,
      MaKT: payRoll.MaKT,
      MaGL: payRoll.MaGL,
      Thang: payRoll.Thang,
    },
  });

  // reset khi mở dialog
  const handleOpenEdit = () => {
    reset({
      MaBL: payRoll.MaBL,
      MaNV: payRoll.MaNV,
      MaLCB: payRoll.MaLCB,
      MaPC: payRoll.MaPC,
      MaKT: payRoll.MaKT,
      MaGL: payRoll.MaGL,
      Thang: payRoll.Thang,
    });
  };

  // submit
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
        {/* ===== UPDATE ===== */}
        {canUpdate(permissions) && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleOpenEdit();
                }}>
                Sửa
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Sửa Bảng Lương
                  </DialogTitle>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  {/* MaLCB */}
                  <Field className="flex flex-col gap-2">
                    <Label>Mã Lương cơ bản</Label>
                    <Input {...register("MaLCB")} />
                    {errors.MaLCB && (
                      <p className="text-red-500 text-sm">
                        {errors.MaLCB.message}
                      </p>
                    )}
                  </Field>

                  {/* MaNV */}
                  <Field className="flex flex-col gap-2">
                    <Label>Mã Nhân Viên</Label>
                    <Input {...register("MaNV")} />
                    {errors.MaNV && (
                      <p className="text-red-500 text-sm">
                        {errors.MaNV.message}
                      </p>
                    )}
                  </Field>

                  {/* MaKT */}
                  <Field className="flex flex-col gap-2">
                    <Label>Mã Khấu Trừ</Label>
                    <Input {...register("MaKT")} />
                    {errors.MaKT && (
                      <p className="text-red-500 text-sm">
                        {errors.MaKT.message}
                      </p>
                    )}
                  </Field>

                  {/* MaPC */}
                  <Field className="flex flex-col gap-2">
                    <Label>Mã Phụ Cấp</Label>
                    <Input {...register("MaPC")} />
                    {errors.MaPC && (
                      <p className="text-red-500 text-sm">
                        {errors.MaPC.message}
                      </p>
                    )}
                  </Field>

                  {/* MaGL */}
                  <Field className="flex flex-col gap-2">
                    <Label>Mã Giờ Làm</Label>
                    <Input {...register("MaGL")} />
                    {errors.MaGL && (
                      <p className="text-red-500 text-sm">
                        {errors.MaGL.message}
                      </p>
                    )}
                  </Field>

                  {/* Thang */}
                  <Field className="flex flex-col gap-2">
                    <Label>Tháng</Label>
                    <Input type="month" {...register("Thang")} />
                    {errors.Thang && (
                      <p className="text-red-500 text-sm">
                        {errors.Thang.message}
                      </p>
                    )}
                  </Field>
                </FieldGroup>

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Huỷ
                    </Button>
                  </DialogClose>

                  <Button type="submit" disabled={isSubmitting}>
                    Tính lại lương
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* ===== DELETE ===== */}
        {canUpdate(permissions) && canDelete(permissions) && (
          <DropdownMenuSeparator />
        )}

        {canDelete(permissions) && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}>
                Xoá
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Xoá Bảng Lương</DialogTitle>
              </DialogHeader>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Bạn có chắc muốn xoá không?</p>

                <ul>
                  <li>
                    <b>Mã bảng lương:</b> {payRoll.MaBL}
                  </li>
                  <li>
                    <b>Mã nhân viên:</b> {payRoll.MaNV}
                  </li>
                  <li>
                    <b>Mã lương CB:</b> {payRoll.MaLCB}
                  </li>
                  <li>
                    <b>Mã phụ cấp:</b> {payRoll.MaPC}
                  </li>
                  <li>
                    <b>Mã khấu trừ:</b> {payRoll.MaKT}
                  </li>
                  <li>
                    <b>Mã giờ làm:</b> {payRoll.MaGL}
                  </li>
                  <li>
                    <b>Tháng:</b>{" "}
                    <span className="font-semibold text-red-500">
                      {payRoll.Thang}
                    </span>
                  </li>
                </ul>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Huỷ</Button>
                </DialogClose>

                <Button
                  variant="destructive"
                  onClick={() => deletePayRoll(payRoll.MaBL)}>
                  Xoá
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
