import * as React from "react";
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
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function AllowanceActionCell({ allowance }: { allowance: Allowance }) {
  const { t } = useTranslation();
  const { deleteAllowance, updateAllowance } = useAllowanceStore();
  const { permissions } = useAuthorizeStore();

  const [formData, setFormData] = React.useState({
    LoaiPC: allowance.LoaiPC,
    SoTien: allowance.SoTien,
  });

  if (!canWrite(permissions)) return null;

  const handleOpenEdit = () => {
    setFormData({ LoaiPC: allowance.LoaiPC, SoTien: allowance.SoTien });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAllowance(allowance.MaPC, {
      MaPC: allowance.MaPC,
      ...formData,
    });
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
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleOpenEdit();
                }}
              >
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleUpdate} className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    {t("Sửa Phụ Cấp")}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {t("Nhập thông tin chi tiết để cập nhật.")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="LoaiPC">{t("Loại Phụ Cấp")}</Label>
                    <Input
                      id="LoaiPC"
                      className="h-10"
                      value={formData.LoaiPC}
                      onChange={(e) =>
                        setFormData({ ...formData, LoaiPC: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="SoTien">{t("Số Tiền")}</Label>
                    <Input
                      id="SoTien"
                      type="number"
                      className="h-10"
                      value={formData.SoTien}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          SoTien: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {t("Huỷ")}
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={!formData.LoaiPC || formData.SoTien <= 0}
                  >
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
                <FieldGroup>
                  <Field>
                    <Label>
                      {t("Bạn có chắc muốn xoá phụ cấp")}{" "}
                      <strong>{allowance.LoaiPC}</strong>?
                    </Label>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t("Huỷ")}</Button>
                  </DialogClose>
                  <Button onClick={() => deleteAllowance(allowance.MaPC)}>
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
