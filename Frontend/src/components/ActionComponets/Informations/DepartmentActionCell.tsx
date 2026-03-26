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

import { useDepartmentStore } from "@/stores/informationStores/departmentStores";
import { useEffect, useState } from "react";
import type { Department } from "@/types/informationTypes/departmentTypes";

export function DepartmentActionCell({ dept }: { dept: Department }) {
  const { deleteDepartment, updateDepartment } = useDepartmentStore();

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<Department>(dept);

  // Reset form data to current department info whenever the edit dialog is opened
  useEffect(() => {
    if (editOpen) {
      setFormData(dept);
    }
  }, [editOpen, dept]);

  const handleUpdate = async () => {
    await updateDepartment(dept.MaPB, formData);
    setEditOpen(false);
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
        {/* ================= EDIT ================= */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setEditOpen(true);
              }}
            >
              Sửa
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sửa thông tin phòng ban</DialogTitle>
            </DialogHeader>

            <FieldGroup>
              {/* MaPB */}
              <Field>
                <Label htmlFor="MaPB">Mã phòng ban</Label>
                <Input id="MaPB" value={formData.MaPB} disabled />
              </Field>

              {/* TenPB */}
              <Field>
                <Label htmlFor="TenPB">Tên phòng ban</Label>
                <Input
                  id="TenPB"
                  value={formData.TenPB}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, TenPB: e.target.value }))
                  }
                />
              </Field>

              {/* MoTa */}
              <Field>
                <Label htmlFor="MoTa">Mô tả</Label>
                <Input
                  id="MoTa"
                  value={formData.MoTa || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, MoTa: e.target.value }))
                  }
                />
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

        <DropdownMenuSeparator />

        {/* ================= DELETE ================= */}
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
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
                  Bạn có chắc chắn muốn xoá phòng ban <strong>{dept.TenPB}</strong> ({dept.MaPB}) không?
                </Label>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => deleteDepartment(dept.MaPB)}
              >
                Xoá
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}