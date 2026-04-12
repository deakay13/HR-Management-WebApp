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

import { useDeductionStore } from "@/stores/payRollStores/deductionStore";
import type { Deduction } from "@/types/payRollTypes/deductionTypes";

// 🔥 thêm
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeductionInputSchema,
  type DeductionInput,
} from "@/types/payRollTypes/deductionTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import React from "react";

export function DeductionActionCell({ deduction }: { deduction: Deduction }) {
  const { deleteDeduction, updateDeduction } = useDeductionStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = React.useState(false);

  if (!canWrite(permissions)) return null;

  //  react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeductionInput>({
    resolver: zodResolver(DeductionInputSchema) as any,
    defaultValues: {
      MaKT: deduction.MaKT,
      LoaiKT: deduction.LoaiKT,
      PhanTram: deduction.PhanTram,
    },
  });

  // reset khi mở dialog
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
                    Sửa Khấu Trừ
                  </DialogTitle>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  {/* LoaiKT */}
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="LoaiKT">Loại Khấu Trừ</Label>
                    <Input
                      id="LoaiKT"
                      placeholder="VD: Thuế TNCN"
                      className="h-10"
                      {...register("LoaiKT")}
                    />
                    {errors.LoaiKT && (
                      <p className="text-red-500 text-sm">
                        {errors.LoaiKT.message}
                      </p>
                    )}
                  </Field>

                  {/* PhanTram */}
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="PhanTram">Phần trăm (%)</Label>
                    <Input
                      id="PhanTram"
                      type="number"
                      placeholder="VD: 10"
                      className="h-10"
                      {...register("PhanTram")}
                    />
                    {errors.PhanTram && (
                      <p className="text-red-500 text-sm">
                        {errors.PhanTram.message}
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
                <DialogTitle>Xoá Khấu Trừ</DialogTitle>
              </DialogHeader>

              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Bạn có chắc muốn xoá không?</p>
                <ul>
                  <li>
                    <b>Mã khấu trừ:</b> {deduction.MaKT}
                  </li>
                  <li>
                    <b>Loại:</b> {deduction.LoaiKT}
                  </li>
                  <li>
                    <b>Phần trăm:</b>{" "}
                    <span className="text-red-500 font-semibold">
                      {Number(deduction.PhanTram)}%
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
                  onClick={() => deleteDeduction(deduction.MaKT)}>
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
