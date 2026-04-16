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
  const [oldQuyen, setOldQuyen] = React.useState("");
  const [newQuyen, setNewQuyen] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);

  const [formData, setFormData] = React.useState({
    TenVaiTro: rol.TenVaiTro,
  });

  const handleOpenEdit = () => {
    setFormData({ TenVaiTro: rol.TenVaiTro });
  };
  const handleOpenAssign = () => {
    setSelectedPermissions([]);
  };
  const handleOpenDeletePermissions = () => {
    setSelectedPermissions([]);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRoles(rol.MaVT, { MaVT: rol.MaVT, ...formData });
  };
  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };
  const handleDeleteSelected = async () => {
    for (const permId of selectedPermissions) {
      await deleteOneGrantPermissions(rol.MaVT, permId);
    }
    setSelectedPermissions([]);
    await getGrantPermissions();
  };
  const handleOpenChangePermission = () => {
    setOldQuyen(rol.permissions[0]?.MaQuyen ?? "");
    setNewQuyen("");
  };
  const handleChangePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGrantPermissions(rol.MaVT, oldQuyen, newQuyen);
    setOldQuyen("");
    setNewQuyen("");
  };
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    await assigGrantPermissions({
      MaVT: rol.MaVT,
      MaQuyen: selectedPermissions,
    });
    setSelectedPermissions([]);
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
            <Dialog>
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
                <form onSubmit={handleAssign} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>{t("Cấp Quyền")}</DialogTitle>
                    <DialogDescription>
                      {t("Tích chọn Quyền để cấp cho vai trò")} {rol.TenVaiTro}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <Label>{t("Tên Vai Trò")}</Label>
                      <Input value={rol.TenVaiTro} disabled />
                    </Field>
                    <Field>
                      <Label>{t("Danh Sách Quyền")}</Label>
                      <div className="space-y-2 border rounded-md p-3 max-h-60 overflow-y-auto">
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
                            <label key={p.MaQuyen} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(p.MaQuyen)}
                                onChange={() => togglePermission(p.MaQuyen)}
                              />
                              {p.TenQuyen}
                            </label>
                          ))
                        )}
                      </div>
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">{t("Huỷ")}</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="submit" disabled={selectedPermissions.length === 0}>
                        {t("Cấp Quyền")}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Sửa Vai Trò */}
            {isAdmin && (
              <Dialog>
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
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>{t("Sửa Vai Trò")}</DialogTitle>
                      <DialogDescription>
                        {t("Nhập thông tin mới và Lưu thay đổi để lưu.")}
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="TenVaiTro">{t("Tên Vai Trò")}</Label>
                        <Input
                          id="TenVaiTro"
                          name="TenVaiTro"
                          value={formData.TenVaiTro}
                          onChange={(e) =>
                            setFormData({ ...formData, TenVaiTro: e.target.value })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">{t("Huỷ")}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={!formData.TenVaiTro}>
                        {t("Lưu thay đổi")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Thay đổi Quyền */}
            {isAdmin && (
              <Dialog>
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
                  <form onSubmit={handleChangePermission} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>{t("Thay Đổi Quyền")}</DialogTitle>
                      <DialogDescription>
                        {t("Chọn quyền cũ và quyền mới để thay đổi")}
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>{t("Quyền Hiện Tại")}</Label>
                        <Select value={oldQuyen} onValueChange={setOldQuyen}>
                          <SelectTrigger>
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
                      </Field>
                      <Field>
                        <Label>{t("Quyền Mới")}</Label>
                        <Select value={newQuyen} onValueChange={setNewQuyen}>
                          <SelectTrigger>
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
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">{t("Huỷ")}</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" disabled={!oldQuyen || !newQuyen}>
                          {t("Thay Đổi")}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                {/* Xoá Từng Quyền */}
                <Dialog>
                  <form>
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
                      <DialogHeader>
                        <DialogTitle>{t("Lựa Chọn Quyền Muốn Xoá")}</DialogTitle>
                        <DialogDescription>
                          {t("Tích chọn quyền và bấm Xoá để xoá quyền được chọn")}
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        {rol.permissions.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            {t("Vai trò chưa có quyền nào")}
                          </p>
                        ) : (
                          rol.permissions.map((perm) => (
                            <Field
                              key={perm.MaQuyen}
                              className="flex items-center justify-between">
                              <Label>
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.includes(perm.MaQuyen)}
                                  onChange={() => togglePermission(perm.MaQuyen)}
                                />
                                {perm.TenQuyen}
                              </Label>
                            </Field>
                          ))
                        )}
                      </FieldGroup>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">{t("Huỷ")}</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            disabled={selectedPermissions.length === 0}
                            onClick={handleDeleteSelected}>
                            {t("Xoá Các Quyền Đã Chọn")}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
                {/* Xoá tất cả Quyền */}
                <Dialog>
                  <form>
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
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">{t("Huỷ")}</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={async () =>
                              await deleteAllGrantPermissions(rol.MaVT)
                            }>
                            {t("Xoá")}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
                {/* Xoá Vai trò */}
                <Dialog>
                  <form>
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
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">{t("Huỷ")}</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={async () => await deleteRole(rol.MaVT)}>
                            {t("Xoá")}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
}
