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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEmployeeStore } from "@/stores/informationStores/employeesStores";
import { useDepartmentStore } from "@/stores/informationStores/departmentStores";

import { useEffect, useState } from "react";
import type { Employee } from "@/types/informationTypes/employeeTypes";
import { z } from "zod";
import { getEmployeeValidationSchema } from "@/types/informationTypes/employeeTypes";

export function EmployeesActionCell({ emp }: { emp: Employee }) {
  const { deleteEmployee, updateEmployee } = useEmployeeStore();
  const { departments, getDepartments } = useDepartmentStore();

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<Employee>(emp);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genders = ["Nam", "Nữ", "Khác"];

  // Load phongban
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  // update form data when opening edit dialog
  useEffect(() => {
    if (editOpen) {
      setFormData({
        ...emp,
        NgaySinh: emp.NgaySinh ? emp.NgaySinh.split('T')[0] : "",
        NgayVaoLam: emp.NgayVaoLam ? emp.NgayVaoLam.split('T')[0] : ""
      });
      setErrors({});
    }
  }, [editOpen, emp]);

  const handleUpdate = async () => {
    try {
      getEmployeeValidationSchema([], true).parse(formData);
      setErrors({});

      await updateEmployee(emp.MaNV, formData);
      
      setEditOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
        const newErrors: Record<string, string> = {};
        for (const key in fieldErrors) {
          if (fieldErrors[key]) newErrors[key] = fieldErrors[key][0];
        }
        setErrors(newErrors);
        console.log("Validation Errors:", fieldErrors); 
      } else {
        console.error("Lỗi hệ thống hoặc API:", error);
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
        {/*              EDIT             */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true); }}>Sửa</DropdownMenuItem>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Sửa thông tin nhân viên</DialogTitle></DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="MaNV">Mã nhân viên</Label>
                <Input id="MaNV" value={formData.MaNV} disabled />
              </Field>

              <Field>
                <Label htmlFor="MaPB">Phòng ban</Label>
                <Select
                  value={formData.MaPB}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, MaPB: val }))}
                >
                  <SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.MaPB} value={dept.MaPB}>{dept.MaPB} - {dept.TenPB}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.MaPB && <span className="text-xs text-red-500">{errors.MaPB}</span>}
              </Field>

              <Field>
                <Label htmlFor="HoVaTen">Họ và tên</Label>
                <Input
                  id="HoVaTen"
                  value={formData.HoVaTen}
                  onChange={(e) => setFormData((prev) => ({ ...prev, HoVaTen: e.target.value }))}
                />
                {errors.HoVaTen && <span className="text-xs text-red-500">{errors.HoVaTen}</span>}
              </Field>

              <Field>
                <Label htmlFor="GioiTinh">Giới tính</Label>
                <Select
                  value={formData.GioiTinh}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, GioiTinh: val as any }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {genders.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.GioiTinh && <span className="text-xs text-red-500">{errors.GioiTinh}</span>}
              </Field>

              <Field>
                <Label htmlFor="NgaySinh">Ngày sinh</Label>
                <Input
                  id="NgaySinh"
                  type="date"
                  value={formData.NgaySinh}
                  onChange={(e) => setFormData((prev) => ({ ...prev, NgaySinh: e.target.value }))}
                />
                {errors.NgaySinh && <span className="text-xs text-red-500">{errors.NgaySinh}</span>}
              </Field>

              <Field>
                <Label htmlFor="SDT">Số điện thoại</Label>
                <Input
                  id="SDT"
                  value={formData.SDT}
                  onChange={(e) => setFormData((prev) => ({ ...prev, SDT: e.target.value }))}
                />
                {errors.SDT && <span className="text-xs text-red-500">{errors.SDT}</span>}
              </Field>

              <Field>
                <Label htmlFor="NgayVaoLam">Ngày vào làm</Label>
                <Input
                  id="NgayVaoLam"
                  type="date"
                  value={formData.NgayVaoLam}
                  onChange={(e) => setFormData((prev) => ({ ...prev, NgayVaoLam: e.target.value }))}
                />
                {errors.NgayVaoLam && <span className="text-xs text-red-500">{errors.NgayVaoLam}</span>}
              </Field>

              <Field>
                <Label htmlFor="DiaChi">Địa chỉ</Label>
                <Input
                  id="DiaChi"
                  value={formData.DiaChi}
                  onChange={(e) => setFormData((prev) => ({ ...prev, DiaChi: e.target.value }))}
                />
                {errors.DiaChi && <span className="text-xs text-red-500">{errors.DiaChi}</span>}
              </Field>
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
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