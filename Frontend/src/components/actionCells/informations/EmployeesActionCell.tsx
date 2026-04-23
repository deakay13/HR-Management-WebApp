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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { useEffect, useState } from "react";
import type { Employee } from "@/types/informationTypes/employeeTypes";
import { z } from "zod";
import { getEmployeeValidationSchema } from "@/types/informationTypes/employeeTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function EmployeesActionCell({ emp }: { emp: Employee }) {
  const { t } = useTranslation();
  const { deleteEmployee, updateEmployee } = useEmployeeStore();
  const { departments, getDepartments } = useDepartmentStore();
  const { permissions } = useAuthorizeStore();

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<Employee>(emp);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genders = ["Nam", "Nữ", "Khác"];

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  useEffect(() => {
    if (editOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...emp,
        NgaySinh: emp.NgaySinh ? emp.NgaySinh.split("T")[0] : "",
        NgayVaoLam: emp.NgayVaoLam ? emp.NgayVaoLam.split("T")[0] : "",
      });
      setErrors({});
    }
  }, [editOpen, emp]);

  if (!canWrite(permissions)) return null;

  const handleUpdate = async () => {
    try {
      getEmployeeValidationSchema([], true).parse(formData);
      setErrors({});
      await updateEmployee(emp.MaNV, formData);
      setEditOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors as Record<
          string,
          string[]
        >;
        const newErrors: Record<string, string> = {};
        for (const key in fieldErrors) {
          if (fieldErrors[key]) newErrors[key] = fieldErrors[key][0];
        }
        setErrors(newErrors);
      }
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
        {/* EDIT */}
        {canUpdate(permissions) && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }}
              >
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("Sửa Thông Tin Nhân Viên")}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {t("Nhập thông tin chi tiết để cập nhật.")}
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="MaNV">{t("Mã NV")}</Label>
                  <Input id="MaNV" value={formData.MaNV} disabled />
                </Field>

                <Field>
                  <Label htmlFor="MaPB">{t("Phòng Ban")}</Label>
                  <Select
                    value={formData.MaPB}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, MaPB: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Chọn phòng ban")} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.MaPB} value={dept.MaPB}>
                          {dept.MaPB} - {dept.TenPB}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.MaPB && (
                    <span className="text-xs text-red-500">{errors.MaPB}</span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="HoVaTen">{t("Họ Và Tên")}</Label>
                  <Input
                    id="HoVaTen"
                    value={formData.HoVaTen}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        HoVaTen: e.target.value,
                      }))
                    }
                  />
                  {errors.HoVaTen && (
                    <span className="text-xs text-red-500">
                      {errors.HoVaTen}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="GioiTinh">{t("Giới Tính")}</Label>
                  <Select
                    value={formData.GioiTinh}
                    onValueChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        GioiTinh: val as Employee["GioiTinh"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.GioiTinh && (
                    <span className="text-xs text-red-500">
                      {errors.GioiTinh}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="NgaySinh">{t("Ngày Sinh")}</Label>
                  <Input
                    id="NgaySinh"
                    type="date"
                    value={formData.NgaySinh}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        NgaySinh: e.target.value,
                      }))
                    }
                  />
                  {errors.NgaySinh && (
                    <span className="text-xs text-red-500">
                      {errors.NgaySinh}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="SDT">{t("SĐT")}</Label>
                  <Input
                    id="SDT"
                    value={formData.SDT}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, SDT: e.target.value }))
                    }
                  />
                  {errors.SDT && (
                    <span className="text-xs text-red-500">{errors.SDT}</span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="NgayVaoLam">{t("Ngày Vào Làm")}</Label>
                  <Input
                    id="NgayVaoLam"
                    type="date"
                    value={formData.NgayVaoLam}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        NgayVaoLam: e.target.value,
                      }))
                    }
                  />
                  {errors.NgayVaoLam && (
                    <span className="text-xs text-red-500">
                      {errors.NgayVaoLam}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="DiaChi">{t("Địa Chỉ")}</Label>
                  <Input
                    id="DiaChi"
                    value={formData.DiaChi}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        DiaChi: e.target.value,
                      }))
                    }
                  />
                  {errors.DiaChi && (
                    <span className="text-xs text-red-500">
                      {errors.DiaChi}
                    </span>
                  )}
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("Huỷ")}</Button>
                </DialogClose>
                <Button onClick={handleUpdate}>{t("Lưu thay đổi")}</Button>
              </DialogFooter>
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
            <DialogContent className="sm:max-w-sm" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>{t("Xoá Nhân Viên")}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {t(
                    "Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.",
                  )}
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label>
                    {t("Bạn có chắc muốn xoá nhân viên")}{" "}
                    <strong>{emp.HoVaTen}</strong> ({emp.MaNV})?
                  </Label>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("Huỷ")}</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => deleteEmployee(emp.MaNV)}
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
