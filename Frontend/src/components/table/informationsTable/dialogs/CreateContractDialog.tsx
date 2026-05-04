import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getContractValidationSchema,
  type Contract,
} from "@/types/informationTypes/contractTypes";
import { useCreateContractMutation } from "@/hooks/queries/useContractsQuery";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";
import { useBaseSalariesQuery, useAllowancesQuery } from "@/hooks/queries/usePayrollQueries";

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
  
  const { data: departmentsData } = useDepartmentsQuery({ size: 0 });
  const { data: baseSalariesData } = useBaseSalariesQuery({ size: 0 });
  const { data: allowancesData } = useAllowancesQuery({ size: 0 });

  const {
    register,
    control,
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

      await createContractMutation.mutateAsync(dataToSubmit);
      toast.success(t("Tạo hợp đồng thành công"));
      onOpenChange(false);
      reset();
    } catch (error: unknown) {
      console.error("Lỗi khi tạo hợp đồng:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t("Lỗi khi tạo hợp đồng"));
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
              <Controller
                control={control}
                name="MaNV"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`h-10 ${formErrors.MaNV ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("Chọn nhân viên")} />
                    </SelectTrigger>
                    <SelectContent>
                      {employeesData?.data?.map((emp) => (
                        <SelectItem key={emp.MaNV} value={emp.MaNV}>
                          {emp.MaNV} - {emp.HoVaTen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
              <Controller
                control={control}
                name="MaPB"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className={`h-10 ${formErrors.MaPB ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("Chọn phòng ban")} />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentsData?.data?.map((dept) => (
                        <SelectItem key={dept.MaPB} value={dept.MaPB}>
                          {dept.MaPB} - {dept.TenPB}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formErrors.MaPB && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaPB.message as string) || "")}
                </span>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaLCB">{t("Mã Lương CB")}</Label>
              <Controller
                control={control}
                name="MaLCB"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className={`h-10 ${formErrors.MaLCB ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("Chọn lương cơ bản")} />
                    </SelectTrigger>
                    <SelectContent>
                      {baseSalariesData?.data?.map((bs) => (
                        <SelectItem key={bs.MaLCB as string} value={bs.MaLCB as string}>
                          {bs.MaLCB as string} - {bs.LuongCB?.toLocaleString()} VNĐ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formErrors.MaLCB && (
                <span className="text-xs text-red-500">
                  {t((formErrors.MaLCB.message as string) || "")}
                </span>
              )}
            </Field>

            <Field className="flex flex-col gap-2">
              <Label htmlFor="MaPC">{t("Mã Phụ Cấp")}</Label>
              <Controller
                control={control}
                name="MaPC"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className={`h-10 ${formErrors.MaPC ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("Chọn phụ cấp")} />
                    </SelectTrigger>
                    <SelectContent>
                      {allowancesData?.data?.map((pc) => (
                        <SelectItem key={pc.MaPC as string} value={pc.MaPC as string}>
                          {pc.MaPC as string} - {pc.LoaiPC as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
