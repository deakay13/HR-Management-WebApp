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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useEffect, useState } from "react";
import type { Account } from "@/types/authTypes/accountTypes";
import type { Role } from "@/types/permissionTypes/rolesTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountUpdateSchema } from "@/types/authTypes/accountTypes";
import type { z } from "zod";

type AccountUpdateForm = z.infer<typeof AccountUpdateSchema>;

export function AccountsActionCell({ acc }: { acc: Account }) {
  const { t } = useTranslation();
  const { updateAccount, deleteAccount } = useAccountsStore();
  const { Roles, getRoles } = useRolesStore();
  const { permissions } = useAuthorizeStore();

  const [editOpen, setEditOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountUpdateForm>({
    resolver: zodResolver(AccountUpdateSchema),
    defaultValues: {
      TenTaiKhoan: acc.TenTaiKhoan,
      MaVT: acc.MaVT,
      MatKhau: "",
    },
  });

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  useEffect(() => {
    if (editOpen) {
      reset({
        TenTaiKhoan: acc.TenTaiKhoan,
        MaVT: acc.MaVT,
        MatKhau: "",
      });
    }
  }, [editOpen, acc.TenTaiKhoan, acc.MaVT, reset]);

  const onUpdateSubmit = async (data: AccountUpdateForm) => {
    try {
      const updateData: Partial<Account> = {};
      if (data.TenTaiKhoan !== acc.TenTaiKhoan) updateData.TenTaiKhoan = data.TenTaiKhoan;
      if (data.MaVT !== acc.MaVT) updateData.MaVT = data.MaVT;
      // Tránh gửi empty password update
      if (data.MatKhau && data.MatKhau.trim() !== "") updateData.MatKhau = data.MatKhau;

      if (Object.keys(updateData).length === 0) {
        setEditOpen(false);
        return;
      }

      await updateAccount(acc.MaTK, updateData);
      setEditOpen(false);
    } catch {
      // keep dialog open on error
    }
  };

  if (!canWrite(permissions)) return null;
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>{t("Sửa Tài Khoản")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Vai Trò")}</Label>
                    <Controller
                      control={control}
                      name="MaVT"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={`w-full max-w-48 ${errors.MaVT ? "border-red-500" : ""}`}>
                            <SelectValue placeholder={t("Chọn vai trò")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Roles.map((vt: Role) => (
                                <SelectItem key={vt.MaVT} value={vt.MaVT}>
                                  {vt.MaVT} - {vt.TenVaiTro}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.MaVT && <p className="text-xs text-red-500">{t(errors.MaVT.message || "")}</p>}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Tên Tài Khoản")}</Label>
                    <Input
                      className={`${errors.TenTaiKhoan ? "border-red-500" : ""}`}
                      {...register("TenTaiKhoan")}
                    />
                    {errors.TenTaiKhoan && <p className="text-xs text-red-500">{t(errors.TenTaiKhoan.message || "")}</p>}
                  </Field>
                  <Field className="flex flex-col gap-2">
                    <Label>{t("Mật Khẩu")}</Label>
                    <Input
                      type="password"
                      placeholder={t("Để trống nếu không đổi")}
                      className={`${errors.MatKhau ? "border-red-500" : ""}`}
                      {...register("MatKhau")}
                    />
                    {errors.MatKhau && <p className="text-xs text-red-500">{t(errors.MatKhau.message || "")}</p>}
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
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
                  <DialogTitle>{t("Xoá Tài Khoản")}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t(
                      "Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.",
                    )}
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label>
                      {t("Bạn có chắc muốn xoá tài khoản đã chọn?")}
                    </Label>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button onClick={() => deleteAccount(acc.MaTK)}>
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
