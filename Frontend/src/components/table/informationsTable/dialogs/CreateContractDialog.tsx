import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getContractValidationSchema,
  type Contract,
} from "@/types/informationTypes/contractTypes";
import { useCreateContractMutation } from "@/hooks/queries/useContractsQuery";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCodes: string[];
}

export function CreateContractDialog({
  open,
  onOpenChange,
  existingCodes,
}: CreateContractDialogProps) {
  const { t } = useTranslation();
  const createContractMutation = useCreateContractMutation();
  const { data: employeesData } = useEmployeesQuery({ size: 0 });
  const employeeCodes = React.useMemo(() => employeesData?.data?.map((emp) => emp.MaNV.toUpperCase()) || [], [employeesData]);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    reset,
  } = useForm<Contract>({
    resolver: zodResolver(
      getContractValidationSchema(existingCodes, employeeCodes)
    ),
    defaultValues: {
      MaHopDong: "",
      MaNV: "",
      LoaiHD: "",
      NgayBatDau: "",
      NgayKetThuc: "",
      NgayKy: "",
      ChucDanh: "",
      MaPB: "",
      MaLCB: "",
      MaPC: "",
      HinhThucTraLuong: "",
      TinhTrang: "",
    },
  });

  // Reset form whenever the dialog opens
  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<Contract> = async (formData) => {
    try {
      const dataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSubmit.append(key, value as string);
      });
      // Handle file separately
      const fileInput = document.getElementById(
        "HinhAnhHopDong"
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        dataToSubmit.append("HinhAnhHopDong", fileInput.files[0]);
      }

      await createContractMutation.mutateAsync(dataToSubmit as any);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Tạo Hợp Đồng Mới")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("Nhập chi tiết hợp đồng để tạo mới.")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaHopDong">{t("Mã Hợp Đồng")}</Label>
              <Input
                id="MaHopDong"
                {...register("MaHopDong")}
                placeholder={t("VD: HD001")}
                className="uppercase h-10"
              />
              {formErrors.MaHopDong && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaHopDong.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaNV">{t("Mã Nhân Viên")}</Label>
              <Input
                id="MaNV"
                {...register("MaNV")}
                placeholder={t("VD: NV001")}
                className="uppercase h-10"
              />
              {formErrors.MaNV && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaNV.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="LoaiHD">{t("Loại Hợp Đồng")}</Label>
              <Input
                id="LoaiHD"
                {...register("LoaiHD")}
                placeholder={t("VD: Có thời hạn")}
                className="h-10"
              />
              {formErrors.LoaiHD && (
                <span className="text-xs text-red-500">
                  {t((formErrors.LoaiHD.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="NgayBatDau">{t("Ngày Bắt Đầu")}</Label>
              <Input
                id="NgayBatDau"
                type="date"
                {...register("NgayBatDau")}
                className="h-10"
              />
              {formErrors.NgayBatDau && (
                <span className="text-xs text-red-500">
                  {t((formErrors.NgayBatDau.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="NgayKetThuc">{t("Ngày Kết Thúc")}</Label>
              <Input
                id="NgayKetThuc"
                type="date"
                {...register("NgayKetThuc")}
                className="h-10"
              />
              {formErrors.NgayKetThuc && (
                <span className="text-xs text-red-500">
                  {t((formErrors.NgayKetThuc.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="NgayKy">{t("Ngày Ký")}</Label>
              <Input
                id="NgayKy"
                type="date"
                {...register("NgayKy")}
                className="h-10"
              />
              {formErrors.NgayKy && (
                <span className="text-xs text-red-500">
                  {t((formErrors.NgayKy.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="ChucDanh">{t("Chức Danh")}</Label>
              <Input
                id="ChucDanh"
                {...register("ChucDanh")}
                placeholder={t("Nhập chức danh")}
                className={`h-10 ${formErrors.ChucDanh ? "border-red-500" : ""}`}
              />
              {formErrors.ChucDanh && (
                <span className="text-xs text-red-500">
                  {t((formErrors.ChucDanh.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaPB">{t("Mã Phòng Ban")}</Label>
              <Input
                id="MaPB"
                {...register("MaPB")}
                placeholder={t("VD: PB001")}
                className={`uppercase h-10 ${formErrors.MaPB ? "border-red-500" : ""}`}
              />
              {formErrors.MaPB && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaPB.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaLCB">{t("Mã Lương CB")}</Label>
              <Input
                id="MaLCB"
                {...register("MaLCB")}
                placeholder={t("VD: LCB001")}
                className={`uppercase h-10 ${formErrors.MaLCB ? "border-red-500" : ""}`}
              />
              {formErrors.MaLCB && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaLCB.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
              <Input
                id="MaPC"
                {...register("MaPC")}
                placeholder={t("VD: PC001")}
                className={`uppercase h-10 ${formErrors.MaPC ? "border-red-500" : ""}`}
              />
              {formErrors.MaPC && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaPC.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="HinhThucTraLuong">
                {t("Hình Thức Trả Lương")}
              </Label>
              <Input
                id="HinhThucTraLuong"
                {...register("HinhThucTraLuong")}
                placeholder={t("VD: Chuyển khoản")}
                className={`h-10 ${formErrors.HinhThucTraLuong ? "border-red-500" : ""}`}
              />
              {formErrors.HinhThucTraLuong && (
                <span className="text-xs text-red-500">
                  {t((formErrors.HinhThucTraLuong.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="TinhTrang">{t("Tình Trạng")}</Label>
              <Input
                id="TinhTrang"
                {...register("TinhTrang")}
                placeholder={t("VD: Còn hiệu lực")}
                className={`h-10 ${formErrors.TinhTrang ? "border-red-500" : ""}`}
              />
              {formErrors.TinhTrang && (
                <span className="text-xs text-red-500">
                  {t((formErrors.TinhTrang.message as string) || "")}
                </span>
              )}
            </Field>
            <Field className="flex flex-col gap-2">
              <Label htmlFor="HinhAnhHopDong">{t("Hình ảnh (File)")}</Label>
              <Input
                id="HinhAnhHopDong"
                name="HinhAnhHopDong"
                type="file"
                accept=".pdf"
                className="h-10"
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t("Huỷ")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {t("Tạo mới")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
