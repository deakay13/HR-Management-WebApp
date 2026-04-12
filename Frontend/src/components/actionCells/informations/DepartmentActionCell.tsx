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

import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { useEffect, useState } from "react";
import type { Department } from "@/types/informationTypes/departmentTypes";
import { z } from "zod";
import { getDepartmentValidationSchema } from "@/types/informationTypes/departmentTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { canUpdate, canDelete, canWrite } from "@/utils/authorizeUtils";

export function DepartmentActionCell({ dept }: { dept: Department }) {
  const { deleteDepartment, updateDepartment } = useDepartmentStore();
  const { permissions } = useAuthorizeStore();
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<Department>(dept);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editOpen) {
      setFormData(dept);
      setErrors({});
    }
  }, [editOpen, dept]);

  if (!canWrite(permissions)) return null;

  const handleUpdate = async () => {
    try {
      getDepartmentValidationSchema([]).parse({
        MaPB: formData.MaPB,
        TenPB: formData.TenPB,
      });

      setErrors({});
      await updateDepartment(dept.MaPB, {
        MaPB: formData.MaPB,
        TenPB: formData.TenPB,
      });
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
        <Button variant="ghost" className="flex size-8" size="icon">
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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sửa thông tin phòng ban</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="MaPB">Mã phòng ban</Label>
                  <Input id="MaPB" value={formData.MaPB} disabled />
                </Field>
                <Field>
                  <Label htmlFor="TenPB">Tên phòng ban</Label>
                  <Input
                    id="TenPB"
                    value={formData.TenPB}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        TenPB: e.target.value,
                      }))
                    }
                  />
                  {errors.TenPB && (
                    <span className="text-xs text-red-500">{errors.TenPB}</span>
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
                <DialogTitle>Xoá phòng ban</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label>
                    Bạn có chắc chắn muốn xoá phòng ban{" "}
                    <strong>{dept.TenPB}</strong> ({dept.MaPB}) không?
                  </Label>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => deleteDepartment(dept.MaPB)}>
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
