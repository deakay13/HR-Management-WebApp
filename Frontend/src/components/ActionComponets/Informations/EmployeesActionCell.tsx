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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEmployeeStore } from "@/stores/informationStores/employeesStores";
import { useDepartmentStore } from "@/stores/informationStores/departmentStores";

import { useEffect, useState } from "react";
import type { Employee } from "@/types/informationTypes/employeeTypes";
import type { E } from "node_modules/react-router/dist/development/router-cLsU7kHk.d.mts";

export function EmployeesActionCell({ emp }: { emp: Employee }) {
  const { deleteEmployee, updateEmployee } = useEmployeeStore();
  const { departments, getDepartments } = useDepartmentStore();

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<Employee>(emp);

  const genders = ["Nam", "Nữ", "Khác"];

  // Load phongban
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  // update form data when opening edit dialog
  useEffect(() => {
    if (editOpen) {
      setFormData(emp);
    }
  }, [editOpen, emp]);

  const handleUpdate = async () => {
    await updateEmployee(emp.MaNV, formData);
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
        {/*              EDIT             */}
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
              <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
            </DialogHeader>

            <FieldGroup>
              {/* MaNV (do not edit) */}
              <Field>
                <Label htmlFor="MaNV">Mã nhân viên</Label>
                <Input id="MaNV" value={formData.MaNV} disabled />
              </Field>

              {/* Phongban */}
              <Field>
                <Label htmlFor="MaPB">Phòng ban</Label>
                <Select
                  value={formData.MaPB}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, MaPB: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.MaPB} value={dept.MaPB}>
                          {dept.MaPB} - {dept.TenPB}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Name */}
              <Field>
                <Label htmlFor="HoVaTen">Họ và tên</Label>
                <Input
                  id="HoVaTen"
                  value={formData.HoVaTen}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, HoVaTen: e.target.value }))
                  }
                />
              </Field>

              {/* Gender */}
              <Field>
                <Label htmlFor="GioiTinh">Giới tính</Label>
                <Select
                  value={formData.GioiTinh || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, GioiTinh: value as Employee["GioiTinh"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Birthday */}
              <Field>
                <Label htmlFor="NgaySinh">Ngày sinh</Label>
                <Input
                  id="NgaySinh"
                  type="date"
                  value={formData.NgaySinh || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, NgaySinh: e.target.value }))
                  }
                />
              </Field>

              {/* Phone */}
              <Field>
                <Label htmlFor="SoDienThoai">Số điện thoại</Label>
                <Input
                  id="SoDienThoai"
                  value={formData.SDT || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, SDT: e.target.value }))
                  }
                />
              </Field>

              {/* Join Date */}
              <Field>
                <Label htmlFor="NgayVaoLam">Ngày vào làm</Label>
                <Input
                  id="NgayVaoLam"
                  type="date"
                  value={formData.NgayVaoLam || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, NgayVaoLam: e.target.value }))
                  }
                />
              </Field>

              {/* Address */}
              <Field>
                <Label htmlFor="DiaChi">Địa chỉ</Label>
                <Input
                  id="DiaChi"
                  value={formData.DiaChi || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, DiaChi: e.target.value }))
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

        {/*              DELETE             */}
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
              <DialogTitle>Xoá nhân viên</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label>
                  Bạn có muốn xoá nhân viên <strong>{emp.HoVaTen}</strong> ({emp.MaNV}) không?
                </Label>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => deleteEmployee(emp.MaNV)}
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