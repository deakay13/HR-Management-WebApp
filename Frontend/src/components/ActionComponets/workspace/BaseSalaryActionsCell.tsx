
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

import { useBaseSalaryStore } from "@/stores/payRollStores/baseSalaryStores";
import type { BaseSalary } from "@/types/payRollTypes/baseSalaryTypes";

// 🔥 thêm
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaseSalaryInputSchema,
  type BaseSalaryInput,
} from "@/types/payRollTypes/baseSalaryTypes";

export function BaseSalaryActionCell({
  baseSalary,
}: {
  baseSalary: BaseSalary;
}) {
  const { deleteBaseSalary, updateBaseSalary } = useBaseSalaryStore();

  // 🔥 react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BaseSalaryInput>({
    resolver: zodResolver(BaseSalaryInputSchema) as any,
    defaultValues: {
      MaLCB: baseSalary.MaLCB,
      LuongCB: baseSalary.LuongCB,
    },
  });

  // reset khi mở dialog
  const handleOpenEdit = () => {
    reset({
      MaLCB: baseSalary.MaLCB,
      LuongCB: baseSalary.LuongCB,
    });
  };

  const onSubmit = async (data: BaseSalaryInput) => {
    await updateBaseSalary(baseSalary.MaLCB, data);
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
                  Sửa Lương Cơ Bản
                </DialogTitle>
              </DialogHeader>

              <FieldGroup className="space-y-4">
                <Field className="flex flex-col gap-2">
                  <Label htmlFor="LuongCB">Lương Cơ Bản</Label>

                  <Input
                    id="LuongCB"
                    type="number"
                    className="h-10"
                    {...register("LuongCB")}
                  />

                  {/* 🔥 ERROR */}
                  {errors.LuongCB && (
                    <p className="text-red-500 text-sm">
                      {errors.LuongCB.message}
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
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator />

        {/* ===== DELETE ===== */}
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              Xoá
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Xoá Lương Cơ Bản</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              Bạn có chắc muốn xoá <b>{baseSalary.MaLCB}</b> không?
            </p>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Huỷ</Button>
              </DialogClose>

              <Button
                variant="destructive"
                onClick={() => deleteBaseSalary(baseSalary.MaLCB)}
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