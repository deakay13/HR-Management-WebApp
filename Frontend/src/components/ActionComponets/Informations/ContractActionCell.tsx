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

export function ContractActionCell({ contract }: { contract: Contract }) {
  const { deleteContract, updateContract } = useContractStore();
  const [editOpen, setEditOpen] = useState(false);
  
  const [formDataState, setFormDataState] = useState<Contract>(contract);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (editOpen) {
      setFormDataState(contract);
      setFile(null);
    }
  }, [editOpen, contract]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("MaNV", formDataState.MaNV);
    formData.append("LoaiHD", formDataState.LoaiHD);
    formData.append("NgayBatDau", formDataState.NgayBatDau);
    formData.append("NgayKetThuc", formDataState.NgayKetThuc);
    if (file) {
      formData.append("HinhAnhHopDong", file);
    }

    await updateContract(contract.MaHopDong, formData);
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
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true); }}>
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
                <Input id="MaHopDong" value={formDataState.MaHopDong} disabled />
              </Field>

              <Field>
                <Label htmlFor="MaNV">Mã nhân viên</Label>
                <Input
                  id="MaNV"
                  value={formDataState.MaNV}
                  onChange={(e) => setFormDataState((prev) => ({ ...prev, MaNV: e.target.value }))}
                />
              </Field>

              <Field>
                <Label htmlFor="LoaiHD">Loại hợp đồng</Label>
                <Input
                  id="LoaiHD"
                  value={formDataState.LoaiHD}
                  onChange={(e) => setFormDataState((prev) => ({ ...prev, LoaiHD: e.target.value }))}
                />
              </Field>

              <Field>
                <Label htmlFor="NgayBatDau">Ngày bắt đầu</Label>
                <Input
                  id="NgayBatDau"
                  type="date"
                  value={formDataState.NgayBatDau}
                  onChange={(e) => setFormDataState((prev) => ({ ...prev, NgayBatDau: e.target.value }))}
                />
              </Field>

              <Field>
                <Label htmlFor="NgayKetThuc">Ngày kết thúc</Label>
                <Input
                  id="NgayKetThuc"
                  type="date"
                  value={formDataState.NgayKetThuc}
                  onChange={(e) => setFormDataState((prev) => ({ ...prev, NgayKetThuc: e.target.value }))}
                />
              </Field>

              <Field>
                <Label htmlFor="HinhAnhHopDong">Hình ảnh hợp đồng (để trống nếu không đổi)</Label>
                <Input
                  id="HinhAnhHopDong"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button onClick={handleUpdate}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator />

        {/* ================= DELETE ================= */}
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
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
                  Bạn có chắc chắn muốn xoá hợp đồng <strong>{contract.MaHopDong}</strong> không?
                </Label>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => deleteContract(contract.MaHopDong)}>
                Xoá
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}