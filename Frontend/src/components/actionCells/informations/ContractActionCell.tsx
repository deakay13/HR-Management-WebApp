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

import {
  useUpdateContractMutation,
  useDeleteContractMutation,
} from "@/hooks/queries/useContractsQuery";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";
import { useBaseSalariesQuery, useAllowancesQuery } from "@/hooks/queries/usePayrollQueries";
import { useEffect, useState } from "react";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { getContractValidationSchema } from "@/types/informationTypes/contractTypes";
import { z } from "zod";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function ContractActionCell({ contract }: { contract: Contract }) {
  const { t } = useTranslation();
  const updateContractMutation = useUpdateContractMutation();
  const deleteContractMutation = useDeleteContractMutation();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = useState(false);
  const { data: employeesData } = useEmployeesQuery({ size: 0 });
  const employees = employeesData?.data || [];
  
  const { data: departmentsData } = useDepartmentsQuery({ size: 0 });
  const { data: baseSalariesData } = useBaseSalariesQuery({ size: 0 });
  const { data: allowancesData } = useAllowancesQuery({ size: 0 });

  const [formDataState, setFormDataState] = useState<Contract>(contract);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormDataState(contract);
      setFile(null);
      setErrors({});
    }
  }, [editOpen, contract]);

  if (!canWrite(permissions)) return null;

  const handleUpdate = async () => {
    const employeeCodes = employees.map((emp) => emp.MaNV.toUpperCase());
    try {
      const validatedData = getContractValidationSchema(
        [],
        employeeCodes,
        true,
      ).parse({
        MaHopDong: formDataState.MaHopDong,
        MaNV: formDataState.MaNV,
        LoaiHD: formDataState.LoaiHD,
        NgayBatDau: formDataState.NgayBatDau,
        NgayKetThuc: formDataState.NgayKetThuc,
        NgayKy: formDataState.NgayKy,
        ChucDanh: formDataState.ChucDanh,
        MaPB: formDataState.MaPB,
        MaLCB: formDataState.MaLCB,
        MaPC: formDataState.MaPC,
        HinhThucTraLuong: formDataState.HinhThucTraLuong,
        TinhTrang: formDataState.TinhTrang,
        HinhAnhHopDong: file,
      });

      setErrors({});

      const formData = new FormData();
      formData.append("MaNV", validatedData.MaNV);
      formData.append("LoaiHD", validatedData.LoaiHD);
      formData.append("NgayBatDau", validatedData.NgayBatDau);
      formData.append("NgayKetThuc", validatedData.NgayKetThuc || "");
      formData.append("NgayKy", validatedData.NgayKy || "");
      formData.append("ChucDanh", validatedData.ChucDanh || "");
      formData.append("MaPB", validatedData.MaPB || "");
      formData.append("MaLCB", validatedData.MaLCB || "");
      formData.append("MaPC", validatedData.MaPC || "");
      formData.append("HinhThucTraLuong", validatedData.HinhThucTraLuong || "");
      formData.append("TinhTrang", validatedData.TinhTrang || "");
      formData.append("MaHopDong", validatedData.MaHopDong);
      if (file) formData.append("HinhAnhHopDong", file);

      await updateContractMutation.mutateAsync({
        id: contract.MaHopDong,
        data: formData,
      });
      setEditOpen(false);
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
                  setEditOpen(true);
                }}
              >
                {t("Sửa")}
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("Sửa Thông Tin Hợp Đồng")}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {t("Nhập thông tin chi tiết để cập nhật.")}
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="MaHopDong">{t("Mã HĐ")}</Label>
                  <Input
                    id="MaHopDong"
                    value={formDataState.MaHopDong}
                    disabled
                  />
                </Field>

                <Field>
                  <Label htmlFor="MaNV">{t("Mã NV")}</Label>
                  <Select
                    value={formDataState.MaNV}
                    onValueChange={(val) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        MaNV: val,
                      }))
                    }
                  >
                    <SelectTrigger className={errors.MaNV ? "border-red-500" : ""}>
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
                  {errors.MaNV && (
                    <span className="text-xs text-red-500">{errors.MaNV}</span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="LoaiHD">{t("Loại HĐ")}</Label>
                  <Input
                    id="LoaiHD"
                    value={formDataState.LoaiHD}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        LoaiHD: e.target.value,
                      }))
                    }
                  />
                  {errors.LoaiHD && (
                    <span className="text-xs text-red-500">
                      {errors.LoaiHD}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="NgayBatDau">{t("Ngày Bắt Đầu")}</Label>
                  <Input
                    id="NgayBatDau"
                    type="date"
                    value={formDataState.NgayBatDau}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        NgayBatDau: e.target.value,
                      }))
                    }
                  />
                  {errors.NgayBatDau && (
                    <span className="text-xs text-red-500">
                      {errors.NgayBatDau}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="NgayKetThuc">{t("Ngày Kết Thúc")}</Label>
                  <Input
                    id="NgayKetThuc"
                    type="date"
                    value={formDataState.NgayKetThuc || ""}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        NgayKetThuc: e.target.value,
                      }))
                    }
                  />
                  {errors.NgayKetThuc && (
                    <span className="text-xs text-red-500">
                      {errors.NgayKetThuc}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="NgayKy">{t("Ngày Ký")}</Label>
                  <Input
                    id="NgayKy"
                    type="date"
                    value={formDataState.NgayKy || ""}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        NgayKy: e.target.value,
                      }))
                    }
                  />
                  {errors.NgayKy && (
                    <span className="text-xs text-red-500">
                      {errors.NgayKy}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="ChucDanh">{t("Chức Danh")}</Label>
                  <Input
                    id="ChucDanh"
                    value={formDataState.ChucDanh || ""}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        ChucDanh: e.target.value,
                      }))
                    }
                  />
                  {errors.ChucDanh && (
                    <span className="text-xs text-red-500">
                      {t(errors.ChucDanh || "")}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="MaPB">{t("Mã PB")}</Label>
                  <Select
                    value={formDataState.MaPB || ""}
                    onValueChange={(val) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        MaPB: val,
                      }))
                    }
                  >
                    <SelectTrigger className={errors.MaPB ? "border-red-500" : ""}>
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
                  {errors.MaPB && (
                    <span className="text-xs text-red-500">
                      {t(errors.MaPB || "")}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="MaLCB">{t("Mã LCB")}</Label>
                  <Select
                    value={formDataState.MaLCB || ""}
                    onValueChange={(val) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        MaLCB: val,
                      }))
                    }
                  >
                    <SelectTrigger className={errors.MaLCB ? "border-red-500" : ""}>
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
                  {errors.MaLCB && (
                    <span className="text-xs text-red-500">
                      {t(errors.MaLCB || "")}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="MaPC">{t("Mã PC")}</Label>
                  <Select
                    value={formDataState.MaPC || ""}
                    onValueChange={(val) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        MaPC: val,
                      }))
                    }
                  >
                    <SelectTrigger className={errors.MaPC ? "border-red-500" : ""}>
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
                  {errors.MaPC && (
                    <span className="text-xs text-red-500">
                      {t(errors.MaPC || "")}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="HinhThucTraLuong">{t("Hình Thức Trả Lương")}</Label>
                  <Input
                    id="HinhThucTraLuong"
                    value={formDataState.HinhThucTraLuong || ""}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        HinhThucTraLuong: e.target.value,
                      }))
                    }
                  />
                  {errors.HinhThucTraLuong && (
                    <span className="text-xs text-red-500">
                      {t(errors.HinhThucTraLuong || "")}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="TinhTrang">{t("Tình Trạng")}</Label>
                  <Input
                    id="TinhTrang"
                    value={formDataState.TinhTrang || ""}
                    onChange={(e) =>
                      setFormDataState((prev: Contract) => ({
                        ...prev,
                        TinhTrang: e.target.value,
                      }))
                    }
                  />
                  {errors.TinhTrang && (
                    <span className="text-xs text-red-500">
                      {t(errors.TinhTrang || "")}
                    </span>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="HinhAnhHopDong">
                    {t("Hình Ảnh Hợp Đồng")} (PDF)
                  </Label>
                  <Input
                    id="HinhAnhHopDong"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                  {errors.HinhAnhHopDong && (
                    <span className="text-xs text-red-500">
                      {errors.HinhAnhHopDong}
                    </span>
                  )}
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {t("Huỷ")}
                  </Button>
                </DialogClose>
                <Button onClick={handleUpdate}>{t("Lưu thay đổi")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {canUpdate(permissions) && canDelete(permissions) && (
          <DropdownMenuSeparator />
        )}

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
                <DialogTitle>{t("Xoá Hợp Đồng")}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {t(
                    "Vui lòng xác nhận hành động này. Không thể phục hồi sau khi xoá.",
                  )}
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label>
                    {t("Bạn có chắc muốn xoá hợp đồng")}{" "}
                    <strong>{contract.MaHopDong}</strong>?
                  </Label>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("Huỷ")}</Button>
                </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => deleteContractMutation.mutateAsync(contract.MaHopDong)}
                    disabled={deleteContractMutation.isPending}
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
