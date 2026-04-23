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

import { useContractStore } from "@/stores/informationStores/contractStore";
import { useEffect, useState } from "react";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { getContractValidationSchema } from "@/types/informationTypes/contractTypes";
import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { z } from "zod";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

export function ContractActionCell({ contract }: { contract: Contract }) {
  const { t } = useTranslation();
  const { deleteContract, updateContract } = useContractStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = useState(false);
  const { employees } = useEmployeeStore();
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

      await updateContract(contract.MaHopDong, formData);
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
                  <Input
                    id="MaNV"
                    className="uppercase"
                    value={formDataState.MaNV}
                    onChange={(e) =>
                      setFormDataState((prev) => ({
                        ...prev,
                        MaNV: e.target.value,
                      }))
                    }
                  />
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
                      setFormDataState((prev) => ({
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
                      setFormDataState((prev) => ({
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
                      setFormDataState((prev) => ({
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
                      setFormDataState((prev) => ({
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
                      setFormDataState((prev) => ({
                        ...prev,
                        ChucDanh: e.target.value,
                      }))
                    }
                  />
                </Field>

                <Field>
                  <Label htmlFor="MaPB">{t("Mã PB")}</Label>
                  <Input
                    id="MaPB"
                    className="uppercase"
                    value={formDataState.MaPB || ""}
                    onChange={(e) =>
                      setFormDataState((prev) => ({
                        ...prev,
                        MaPB: e.target.value,
                      }))
                    }
                  />
                </Field>

                <Field>
                  <Label htmlFor="MaLCB">{t("Mã LCB")}</Label>
                  <Input
                    id="MaLCB"
                    className="uppercase"
                    value={formDataState.MaLCB || ""}
                    onChange={(e) =>
                      setFormDataState((prev) => ({
                        ...prev,
                        MaLCB: e.target.value,
                      }))
                    }
                  />
                </Field>

                <Field>
                  <Label htmlFor="MaPC">{t("Mã PC")}</Label>
                  <Input
                    id="MaPC"
                    className="uppercase"
                    value={formDataState.MaPC || ""}
                    onChange={(e) =>
                      setFormDataState((prev) => ({
                        ...prev,
                        MaPC: e.target.value,
                      }))
                    }
                  />
                </Field>

                <Field>
                  <Label htmlFor="HinhThucTraLuong">{t("Hình Thức Trả Lương")}</Label>
                  <Input
                    id="HinhThucTraLuong"
                    value={formDataState.HinhThucTraLuong || ""}
                    onChange={(e) =>
                      setFormDataState((prev) => ({
                        ...prev,
                        HinhThucTraLuong: e.target.value,
                      }))
                    }
                  />
                </Field>

                <Field>
                  <Label htmlFor="TinhTrang">{t("Tình Trạng")}</Label>
                  <Input
                    id="TinhTrang"
                    value={formDataState.TinhTrang || ""}
                    onChange={(e) =>
                      setFormDataState((prev) => ({
                        ...prev,
                        TinhTrang: e.target.value,
                      }))
                    }
                  />
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
                  onClick={() => deleteContract(contract.MaHopDong)}
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
