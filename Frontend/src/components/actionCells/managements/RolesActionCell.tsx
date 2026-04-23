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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import React from "react";
import { useGrantPermissionsStore } from "@/stores/permissionStores/grantPermissionsStore";
import type { RoleWithPermissions } from "@/types/permissionTypes/roleGrantPermissionsTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleInputSchema, type RoleInput } from "@/types/permissionTypes/rolesTypes";

import {
  AssignPermissionSchema,
  ChangePermissionSchema,
  RemovePermissionSchema,
  type AssignPermissionPayload,
  type ChangePermissionPayload,
  type RemovePermissionPayload,
} from "@/types/permissionTypes/grantPermissionsTypes";

export function RolesActionCell({ rol }: { rol: RoleWithPermissions }) {
  const { t } = useTranslation();
  const { deleteRole, updateRoles } = useRolesStore();
  const { role } = useAuthorizeStore();
  const isAdmin = role?.MaVT === "VT001";
  const isHR = role?.MaVT === "VT002";
  const canManagePermissions = isAdmin || isHR;
  const {
    deleteAllGrantPermissions,
    deleteOneGrantPermissions,
    updateGrantPermissions,
    assigGrantPermissions,
    getGrantPermissions,
  } = useGrantPermissionsStore();
  const { Permissions } = usePermissionsStore();

  const [editOpen, setEditOpen] = React.useState(false);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [changePermOpen, setChangePermOpen] = React.useState(false);
  const [deletePermOpen, setDeletePermOpen] = React.useState(false);

  // Form for Edit Role
  const editForm = useForm<RoleInput>({
    resolver: zodResolver(RoleInputSchema) as any,
    defaultValues: {
      MaVT: rol.MaVT,
      TenVaiTro: rol.TenVaiTro,
    },
  });

  // Form for Assign Permission
  const assignForm = useForm<AssignPermissionPayload>({
    resolver: zodResolver(AssignPermissionSchema) as any,
    defaultValues: {
      MaVT: rol.MaVT,
      MaQuyen: [],
    },
  });

  // Form for Change Permission
  const changeForm = useForm<ChangePermissionPayload>({
    resolver: zodResolver(ChangePermissionSchema) as any,
    defaultValues: {
      MaVT: rol.MaVT,
      oldQuyen: "",
      newQuyen: "",
    },
  });

  // Form for Remove Permission
  const removeForm = useForm<RemovePermissionPayload>({
    resolver: zodResolver(RemovePermissionSchema) as any,
    defaultValues: {
      MaVT: rol.MaVT,
      MaQuyen: [],
    },
  });

  const handleOpenEdit = () => {
    editForm.reset({
      MaVT: rol.MaVT,
      TenVaiTro: rol.TenVaiTro,
    });
    setEditOpen(true);
  };

  const handleOpenAssign = () => {
    assignForm.reset({
      MaVT: rol.MaVT,
      MaQuyen: [],
    });
    setAssignOpen(true);
  };

  const handleOpenDeletePermissions = () => {
    removeForm.reset({
      MaVT: rol.MaVT,
      MaQuyen: [],
    });
    setDeletePermOpen(true);
  };

  const onUpdateSubmit = async (data: RoleInput) => {
    try {
      await updateRoles(rol.MaVT, data);
      setEditOpen(false);
    } catch {
      // store handles toast
    }
  };

  const togglePermission = (id: string, mode: "assign" | "remove" = "assign") => {
    const form = mode === "assign" ? assignForm : removeForm;
    const current = form.getValues("MaQuyen");
    const updated = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    
    form.setValue("MaQuyen", updated, { shouldValidate: true });
  };

  const onRemoveSubmit = async (data: RemovePermissionPayload) => {
    try {
      for (const permId of data.MaQuyen) {
        await deleteOneGrantPermissions(rol.MaVT, permId);
      }
      await getGrantPermissions();
      setDeletePermOpen(false);
    } catch {
      // store handles toast
    }
  };

  const handleOpenChangePermission = () => {
    changeForm.reset({
      MaVT: rol.MaVT,
      oldQuyen: rol.permissions[0]?.MaQuyen ?? "",
      newQuyen: "",
    });
    setChangePermOpen(true);
  };

  const onChangeSubmit = async (data: ChangePermissionPayload) => {
    try {
      await updateGrantPermissions(rol.MaVT, data.oldQuyen, data.newQuyen);
      setChangePermOpen(false);
    } catch {
      // store handles toast
    }
  };

  const onAssignSubmit = async (data: AssignPermissionPayload) => {
    try {
      await assigGrantPermissions({
        MaVT: rol.MaVT,
        MaQuyen: data.MaQuyen,
      });
      setAssignOpen(false);
    } catch {
      // store handles toast
    }
  };

  return (
    <>
      {canManagePermissions ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {/* Cấp Quyền */}
            <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleOpenAssign();
                  }}>
                  {t("Cấp Quyền")}
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={assignForm.handleSubmit(onAssignSubmit)} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>{t("Cấp Quyền")}</DialogTitle>
                    <DialogDescription>
                      {t("Tích chọn Quyền để cấp cho vai trò")} {rol.TenVaiTro}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <Label>{t("Tên Vai Trò")}</Label>
                      <Input value={rol.TenVaiTro} disabled className="h-10" />
                    </Field>
                    <Field className="flex flex-col gap-2">
                      <Label>{t("Danh Sách Quyền")}</Label>
                      <div className={`space-y-2 border rounded-md p-3 max-h-60 overflow-y-auto ${assignForm.formState.errors.MaQuyen ? "border-red-500" : ""}`}>
                        {Permissions.filter(
                          (p) => !rol.permissions.some((rp) => rp.MaQuyen === p.MaQuyen),
                        ).length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            {t("Đã được cấp tất cả quyền")}
                          </p>
                        ) : (
                          Permissions.filter(
                            (p) => !rol.permissions.some((rp) => rp.MaQuyen === p.MaQuyen),
                          ).map((p) => (
                            <label key={p.MaQuyen} className="flex items-center gap-3 py-1 cursor-pointer">
                              <input
                                type="checkbox"
                                className="size-4"
                                checked={assignForm.watch("MaQuyen").includes(p.MaQuyen)}
                                onChange={() => togglePermission(p.MaQuyen, "assign")}
                              />
                              <span className="text-sm">{p.TenQuyen}</span>
                            </label>
                          ))
                        )}
                      </div>
                      {assignForm.formState.errors.MaQuyen && (
                        <p className="text-xs text-red-500">{t(assignForm.formState.errors.MaQuyen.message || "")}</p>
                      )}
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t("Huỷ")}</Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      disabled={assignForm.formState.isSubmitting}
                    >
                      {t("Cấp Quyền")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Sửa Vai Trò */}
            {isAdmin && (
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleOpenEdit();
                    }}>
                    {t("Sửa Vai Trò")}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={editForm.handleSubmit(onUpdateSubmit)} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>{t("Sửa Vai Trò")}</DialogTitle>
                      <DialogDescription>
                        {t("Nhập thông tin mới và Lưu thay đổi để lưu.")}
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field className="flex flex-col gap-2">
                        <Label htmlFor="TenVaiTro">{t("Tên Vai Trò")}</Label>
                        <Input
                          id="TenVaiTro"
                          placeholder={t("VD: Nhân viên")}
                          className={`h-10 ${editForm.formState.errors.TenVaiTro ? "border-red-500" : ""}`}
                          {...editForm.register("TenVaiTro")}
                        />
                        {editForm.formState.errors.TenVaiTro && (
                          <p className="text-xs text-red-500">{t(editForm.formState.errors.TenVaiTro.message || "")}</p>
                        )}
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">{t("Huỷ")}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={editForm.formState.isSubmitting}>
                        {t("Lưu thay đổi")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Thay đổi Quyền */}
            {isAdmin && (
              <Dialog open={changePermOpen} onOpenChange={setChangePermOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleOpenChangePermission();
                    }}>
                    {t("Thay Đổi Quyền")}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={changeForm.handleSubmit(onChangeSubmit)} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>{t("Thay Đổi Quyền")}</DialogTitle>
                      <DialogDescription>
                        {t("Chọn quyền cũ và quyền mới để thay đổi")}
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field className="flex flex-col gap-2">
                        <Label>{t("Quyền Hiện Tại")}</Label>
                        <Select 
                          value={changeForm.watch("oldQuyen")} 
                          onValueChange={(val) => changeForm.setValue("oldQuyen", val, { shouldValidate: true })}
                        >
                          <SelectTrigger className={`h-10 ${changeForm.formState.errors.oldQuyen ? "border-red-500" : ""}`}>
                            <SelectValue placeholder={t("Chọn quyền hiện tại")} />
                          </SelectTrigger>
                          <SelectContent>
                            {rol.permissions.map((p) => (
                              <SelectItem key={p.MaQuyen} value={p.MaQuyen}>
                                {p.TenQuyen}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {changeForm.formState.errors.oldQuyen && (
                          <p className="text-xs text-red-500">{t(changeForm.formState.errors.oldQuyen.message || "")}</p>
                        )}
                      </Field>
                      <Field className="flex flex-col gap-2">
                        <Label>{t("Quyền Mới")}</Label>
                        <Select 
                          value={changeForm.watch("newQuyen")} 
                          onValueChange={(val) => changeForm.setValue("newQuyen", val, { shouldValidate: true })}
                        >
                          <SelectTrigger className={`h-10 ${changeForm.formState.errors.newQuyen ? "border-red-500" : ""}`}>
                            <SelectValue placeholder={t("Chọn quyền mới")} />
                          </SelectTrigger>
                          <SelectContent>
                            {Permissions.map(
                              (p: { MaQuyen: string; TenQuyen: string }) => (
                                <SelectItem key={p.MaQuyen} value={p.MaQuyen}>
                                  {p.TenQuyen}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        {changeForm.formState.errors.newQuyen && (
                          <p className="text-xs text-red-500">{t(changeForm.formState.errors.newQuyen.message || "")}</p>
                        )}
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">{t("Huỷ")}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={changeForm.formState.isSubmitting}>
                        {t("Thay Đổi")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                {/* Xoá Từng Quyền */}
                <Dialog open={deletePermOpen} onOpenChange={setDeletePermOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleOpenDeletePermissions();
                      }}>
                      {t("Xoá Từng Quyền")}
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <form onSubmit={removeForm.handleSubmit(onRemoveSubmit)} className="space-y-6">
                      <DialogHeader>
                        <DialogTitle>{t("Lựa Chọn Quyền Muốn Xoá")}</DialogTitle>
                        <DialogDescription>
                          {t("Tích chọn quyền và bấm Xoá để xoá quyền được chọn")}
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup className={`space-y-2 border rounded-md p-3 max-h-60 overflow-y-auto ${removeForm.formState.errors.MaQuyen ? "border-red-500" : ""}`}>
                        {rol.permissions.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            {t("Vai trò chưa có quyền nào")}
                          </p>
                        ) : (
                          rol.permissions.map((perm) => (
                            <Field
                              key={perm.MaQuyen}
                              className="flex items-center justify-between">
                              <label className="flex items-center gap-3 py-1 cursor-pointer w-full">
                                <input
                                  type="checkbox"
                                  className="size-4"
                                  checked={removeForm.watch("MaQuyen").includes(perm.MaQuyen)}
                                  onChange={() => togglePermission(perm.MaQuyen, "remove")}
                                />
                                <span className="text-sm">{perm.TenQuyen}</span>
                              </label>
                            </Field>
                          ))
                        )}
                      </FieldGroup>
                      {removeForm.formState.errors.MaQuyen && (
                        <p className="text-xs text-red-500">{t(removeForm.formState.errors.MaQuyen.message || "")}</p>
                      )}
                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">{t("Huỷ")}</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={removeForm.formState.isSubmitting}>
                          {t("Xoá Các Quyền Đã Chọn")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                {/* Xoá tất cả Quyền */}
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => e.preventDefault()}>
                      {t("Xoá Tất Cả Quyền")}
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>{t("Xoá Tất Cả Quyền")}</DialogTitle>
                      <DialogDescription>
                        {t("Bấm xoá để xoá tất cả quyền được cấp")}
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>{t("Bạn có chắc muốn xoá tất cả quyền?")}</Label>
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">{t("Huỷ")}</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={async () =>
                            await deleteAllGrantPermissions(rol.MaVT)
                          }>
                          {t("Xoá")}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* Xoá Vai trò */}
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => e.preventDefault()}>
                      {t("Xoá Vai Trò")}
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>{t("Xoá Vai Trò")}</DialogTitle>
                      <DialogDescription>
                        {t("Để xoá vai trò bạn phải xoá quyền trước")}
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>
                          {t("Bạn có chắc muốn xoá vai trò")} {rol.MaVT} - {rol.TenVaiTro}?
                        </Label>
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">{t("Huỷ")}</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={async () => await deleteRole(rol.MaVT)}>
                          {t("Xoá")}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
}
