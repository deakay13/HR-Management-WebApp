import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { getEmployeeValidationSchema } from "@/types/informationTypes/employeeTypes";
import { useCreateEmployeeMutation } from "@/hooks/queries/useEmployeesQuery";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCodes: string[];
}

export function CreateEmployeeDialog({
  open,
  onOpenChange,
  existingCodes,
}: CreateEmployeeDialogProps) {
  const { t } = useTranslation();
  const createEmployeeMutation = useCreateEmployeeMutation();
  const { data: departmentsData } = useDepartmentsQuery({ size: 0 });
  const departments = departmentsData?.data || [];

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = {
      MaNV: formData.get("MaNV") as string,
      MaPB: selectedDept,
      HoVaTen: formData.get("HoVaTen") as string,
      GioiTinh: selectedGender,
      NgaySinh: formData.get("NgaySinh") as string,
      SDT: formData.get("SDT") as string,
      NgayVaoLam: formData.get("NgayVaoLam") as string,
      DiaChi: formData.get("DiaChi") as string,
      HinhAnh: (formData.get("HinhAnh") as string) || "",
    };

    try {
      const validatedData = getEmployeeValidationSchema(existingCodes).parse(
        formValues
      );
      setErrors({});
      await createEmployeeMutation.mutateAsync(validatedData as any);
      onOpenChange(false);
      setSelectedDept("");
      setSelectedGender("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0])
            newErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  React.useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setErrors({});
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Tạo nhân viên mới")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("Nhập thông tin chi tiết để tạo mới.")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="MaNV">{t("Mã nhân viên")}</Label>
              <Input
                id="MaNV"
                name="MaNV"
                placeholder={t("NVxxx")}
                className="uppercase"
              />
              {errors.MaNV && (
                <span className="text-xs text-red-500">
                  {t(errors.MaNV || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label>{t("Phòng ban")}</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
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
                <span className="text-xs text-red-500">
                  {t(errors.MaPB || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="HoVaTen">{t("Họ và tên")}</Label>
              <Input id="HoVaTen" name="HoVaTen" />
              {errors.HoVaTen && (
                <span className="text-xs text-red-500">
                  {t(errors.HoVaTen || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label>{t("Giới tính")}</Label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Chọn giới tính")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">{t("Nam")}</SelectItem>
                  <SelectItem value="Nữ">{t("Nữ")}</SelectItem>
                  <SelectItem value="Khác">{t("Khác")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.GioiTinh && (
                <span className="text-xs text-red-500">
                  {t(errors.GioiTinh || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="NgaySinh">{t("Ngày sinh")}</Label>
              <Input id="NgaySinh" name="NgaySinh" type="date" />
              {errors.NgaySinh && (
                <span className="text-xs text-red-500">
                  {t(errors.NgaySinh || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="SDT">{t("Số điện thoại")}</Label>
              <Input id="SDT" name="SDT" />
              {errors.SDT && (
                <span className="text-xs text-red-500">
                  {t(errors.SDT || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="NgayVaoLam">{t("Ngày vào làm")}</Label>
              <Input id="NgayVaoLam" name="NgayVaoLam" type="date" />
              {errors.NgayVaoLam && (
                <span className="text-xs text-red-500">
                  {t(errors.NgayVaoLam || "")}
                </span>
              )}
            </Field>
            <Field>
              <Label htmlFor="DiaChi">{t("Địa chỉ")}</Label>
              <Input id="DiaChi" name="DiaChi" />
              {errors.DiaChi && (
                <span className="text-xs text-red-500">
                  {t(errors.DiaChi || "")}
                </span>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t("Huỷ")}
              </Button>
            </DialogClose>
            <Button type="submit">{t("Tạo nhân viên")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
