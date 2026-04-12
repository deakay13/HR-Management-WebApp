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

import { useHoursStore } from "@/stores/payRollStores/hoursStore";
import type { Hours } from "@/types/payRollTypes/hoursTypes";

// 🔥 thêm
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HoursInputSchema,
  type HoursInput,
} from "@/types/payRollTypes/hoursTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import React from "react";

export function HoursActionCell({ hours }: { hours: Hours }) {
  const { deleteHours, updateHours } = useHoursStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = React.useState(false);

  if (!canWrite(permissions)) return null;

  // 🔥 form chuẩn
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HoursInput>({
    resolver: zodResolver(HoursInputSchema) as any,
    defaultValues: {
      MaGL: hours.MaGL,
      SoGioLam: hours.SoGioLam,
    },
  });

  // reset khi mở dialog
  const handleOpenEdit = () => {
    reset({
      MaGL: hours.MaGL,
      SoGioLam: hours.SoGioLam,
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
          size="icon">
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        {/* ===== UPDATE ===== */}
        {canUpdate(permissions) && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleOpenEdit();
                  setEditOpen(true);
                }}>
                Sửa
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Sửa Giờ Làm
                  </DialogTitle>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="SoGioLam">Số giờ làm</Label>

                    <Input
                      id="SoGioLam"
                      type="number"
                      className="h-10"
                      placeholder="VD: 8"
                      {...register("SoGioLam")}
                    />

                    {/* 🔥 ERROR */}
                    {errors.SoGioLam && (
                      <p className="text-red-500 text-sm">
                        {errors.SoGioLam.message}
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
                    Lưu thay đổi
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {canUpdate(permissions) && canDelete(permissions) && (
          <DropdownMenuSeparator />
        )}

        {/* ===== DELETE ===== */}
        {canDelete(permissions) && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}>
                Xoá
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Xoá Giờ Làm</DialogTitle>
              </DialogHeader>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Bạn có chắc muốn xoá không?</p>

                <ul>
                  <li>
                    <b>Mã giờ làm:</b> {hours.MaGL}
                  </li>
                  <li>
                    <b>Số giờ:</b>{" "}
                    <span className="text-red-500 font-semibold">
                      {Number(hours.SoGioLam)} giờ
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
                  onClick={() => deleteHours(hours.MaGL)}>
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
