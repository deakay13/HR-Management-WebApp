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

import { useAllowanceStore } from "@/stores/payRollStores/allowanceStore";
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AllowanceInputSchema,
  type AllowanceInput,
} from "@/types/payRollTypes/allowanceTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";
import React from "react";

export function AllowanceActionCell({ allowance }: { allowance: Allowance }) {
  const { t } = useTranslation();
  const { deleteAllowance, updateAllowance } = useAllowanceStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AllowanceInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(AllowanceInputSchema) as any,
    defaultValues: {
      MaPC: allowance.MaPC,
      LoaiPC: allowance.LoaiPC,
      SoTien: allowance.SoTien,
    },
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    reset({
      MaPC: allowance.MaPC,
      LoaiPC: allowance.LoaiPC,
      SoTien: allowance.SoTien,
    });
  };

  const onSubmit = async (data: AllowanceInput) => {
    await updateAllowance(allowance.MaPC, data);
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
                    {t("Sửa Phụ Cấp")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="space-y-4">
                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="LoaiPC">{t("Loại Phụ Cấp")}</Label>
                    <Input
                      id="LoaiPC"
                      className="h-10"
                      {...register("LoaiPC")}
                    />
                    {errors.LoaiPC && (
                      <p className="text-red-500 text-sm">
                        {errors.LoaiPC.message}
                      </p>
                    )}
                  </Field>

                  <Field className="flex flex-col gap-2">
                    <Label htmlFor="SoTien">{t("Số Tiền")}</Label>
                    <Input
                      id="SoTien"
                      type="number"
                      className="h-10"
                      {...register("SoTien")}
                    />
                    {errors.SoTien && (
                      <p className="text-red-500 text-sm">
                        {errors.SoTien.message}
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
                  <DialogTitle>{t("Xoá Phụ Cấp")}</DialogTitle>
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
                      <b>{t("Mã Phụ Cấp")}:</b> {allowance.MaPC}
                    </li>
                    <li>
                      <b>{t("Loại")}:</b> {allowance.LoaiPC}
                    </li>
                    <li>
                      <b>{t("Số Tiền")}:</b>{" "}
                      {Number(allowance.SoTien).toLocaleString()} VNĐ
                    </li>
                  </ul>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => deleteAllowance(allowance.MaPC)}
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
