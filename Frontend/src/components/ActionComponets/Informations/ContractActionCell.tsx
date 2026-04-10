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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useContractStore } from "@/stores/informationStores/contractStore";
import { useEffect, useState } from "react";
import type { Contract } from "@/types/informationTypes/contractTypes";
import { getContractValidationSchema } from "@/types/informationTypes/contractTypes";
import { useEmployeeStore } from "@/stores/informationStores/employeesStores";

import { z } from "zod";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtiles";

export function ContractActionCell({ contract }: { contract: Contract }) {
  const { deleteContract, updateContract } = useContractStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = useState(false);
  const { employees } = useEmployeeStore();
  const [formDataState, setFormDataState] = useState<Contract>(contract);
  const [file, setFile] = useState<File | null>(null);

  // State save errors from Zod validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editOpen) {
      setFormDataState(contract);
      setFile(null);
      setErrors({}); // Reset errors
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
        HinhAnhHopDong: file,
      });

      setErrors({});

      const formData = new FormData();

      formData.append("MaNV", validatedData.MaNV);
      formData.append("LoaiHD", validatedData.LoaiHD);
      formData.append("NgayBatDau", validatedData.NgayBatDau);
      formData.append("NgayKetThuc", validatedData.NgayKetThuc);
      formData.append("MaHopDong", validatedData.MaHopDong);

      if (file) {
        formData.append("HinhAnhHopDong", file);
      }

      await updateContract(contract.MaHopDong, formData);
      setEditOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
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
          size="icon">
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
                }}>
                Sửa
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Sửa thông tin hợp đồng</DialogTitle>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="MaHopDong">Mã hợp đồng</Label>
                  <Input
                    id="MaHopDong"
                    value={formDataState.MaHopDong}
                    disabled
                  />
                </Field>

                <Field>
                  <Label htmlFor="MaNV">Mã nhân viên</Label>
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
                  <Label htmlFor="LoaiHD">Loại hợp đồng</Label>
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
                  <Label htmlFor="NgayBatDau">Ngày bắt đầu</Label>
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
                  <Label htmlFor="NgayKetThuc">Ngày kết thúc</Label>
                  <Input
                    id="NgayKetThuc"
                    type="date"
                    value={formDataState.NgayKetThuc}
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
                  <Label htmlFor="HinhAnhHopDong">
                    Hình ảnh hợp đồng (chỉ PDF, để trống nếu không đổi)
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
                    Hủy
                  </Button>
                </DialogClose>
                <Button onClick={handleUpdate}>Lưu thay đổi</Button>
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
                onSelect={(e) => e.preventDefault()}>
                Xoá
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Xoá hợp đồng</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label>
                    Bạn có chắc chắn muốn xoá hợp đồng{" "}
                    <strong>{contract.MaHopDong}</strong> không?
                  </Label>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => deleteContract(contract.MaHopDong)}>
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
