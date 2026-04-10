
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAllowanceStore } from "@/stores/payRollStores/allowanceStores";
import type { Allowance } from "@/types/payRollTypes/allowanceTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AllowanceInputSchema,
  type AllowanceInput,
} from "@/types/payRollTypes/allowanceTypes";

export function AllowanceActionCell({ allowance }: { allowance: Allowance }) {
  const { deleteAllowance, updateAllowance } = useAllowanceStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AllowanceInput>({
    resolver: zodResolver(AllowanceInputSchema) as any,
    defaultValues: {
      MaPC: allowance.MaPC,
      LoaiPC: allowance.LoaiPC,
      SoTien: allowance.SoTien,
    },
  });

  // reset khi mở dialog
  const handleOpenEdit = () => {
    reset({
      MaPC: allowance.MaPC,
      LoaiPC: allowance.LoaiPC,
      SoTien: allowance.SoTien,
    });
  };

    const onSubmit = async (data: AllowanceInput) => {
    await updateAllowance(allowance.MaPC, data);
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
        {/* ===== UPDATE ===== */}
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleOpenEdit();
              }}
            >
              Sửa
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Sửa Phụ Cấp
                </DialogTitle>
              </DialogHeader>

              <FieldGroup className="space-y-4">
                {/* LoaiPC */}
                <Field className="flex flex-col gap-2">
                  <Label htmlFor="LoaiPC">Loại Phụ Cấp</Label>
                  <Input
                    id="LoaiPC"
                    className="h-10"
                    {...register("LoaiPC")}
                  />
                  {errors.LoaiPC && (
                    <p className="text-red-500 text-sm">
                      {errors.LoaiPC.message}
                    </p>
                  )}
                </Field>

                {/* SoTien */}
                <Field className="flex flex-col gap-2">
                  <Label htmlFor="SoTien">Số tiền</Label>
                  <Input
                    id="SoTien"
                    type="number"
                    className="h-10"
                    {...register("SoTien")}
                    />
                  {errors.SoTien && (
                    <p className="text-red-500 text-sm">
                      {errors.SoTien.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Huỷ
                  </Button>
                </DialogClose>

                <Button type="submit" disabled={isSubmitting}>
                  Lưu Thay đổi
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ===== DELETE ===== */}
        <DropdownMenuSeparator />

        <Dialog>
          <form>
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
                <DialogTitle>Xoá Phụ Cấp</DialogTitle>
              </DialogHeader>
            <div className="text-sm space-y-1 text-muted-foreground">
                <p>Bạn có chắc muốn xoá không?</p>

                <ul>
                  <li>
                    <b>Mã phụ cấp:</b> {allowance.MaPC}
                  </li>
                  <li>
                    <b>Loại:</b> {allowance.LoaiPC}
                  </li>
                  <li>
                    <b>Số tiền:</b>{" "}
                    {Number(allowance.SoTien).toLocaleString()} VNĐ
                  </li>
                </ul>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Huỷ</Button>
                </DialogClose>

                <Button
                  variant="destructive"
                  onClick={() => deleteAllowance(allowance.MaPC)}
                >
                  Xoá
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}