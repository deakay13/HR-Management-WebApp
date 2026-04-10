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
import { useRolesStore } from "@/stores/permissionStores/RolesStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import React from "react";
import { useGrantPermissionsStore } from "@/stores/permissionStores/GrantPermissions";
import type { RoleWithPermissions } from "@/types/permissionTypes/Role&GrantPermissionsTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissionsStore } from "@/stores/permissionStores/PermissionsStore";

export function RolesActionsCell({ rol }: { rol: RoleWithPermissions }) {
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
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);

  const [formData, setFormData] = React.useState({
    TenVaiTro: rol.TenVaiTro,
  });
  //  RESET DATA
  const handleOpenEdit = () => {
    setFormData({
      TenVaiTro: rol.TenVaiTro,
    });
  };
  const handleOpenAssign = () => {
    setSelectedPermissions([]);
  };
  const handleOpenDeletePermissions = () => {
    setSelectedPermissions([]);
  };
  //  HANDLE UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRoles(rol.MaVT, {
      MaVT: rol.MaVT,
      ...formData,
    });
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
          <DropdownMenuContent align="end" className="w-32">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleOpenAssign();
                  }}>
                  Cấp Quyền
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleAssign} className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>Cấp Quyền</DialogTitle>
                    <DialogDescription>
                      Tích chọn Quyền để cấp cho vai trò {rol.TenVaiTro}
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <Label>Tên Vai Trò</Label>
                      <Input value={rol.TenVaiTro} disabled />
                    </Field>
                    <Field>
                      <Label>Danh sách Quyền</Label>
                      <div className="space-y-2 border rounded-md p-3 max-h-60 overflow-y-auto">
                        {Permissions.filter(
                          (p) =>
                            !rol.permissions.some(
                              (rp) => rp.MaQuyen === p.MaQuyen,
                            ),
                        ).length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            Đã được cấp tất cả quyền
                          </p>
                        ) : (
                          Permissions.filter(
                            (p) =>
                              !rol.permissions.some(
                                (rp) => rp.MaQuyen === p.MaQuyen,
                              ),
                          ).map((p) => (
                            <label
                              key={p.MaQuyen}
                              className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(
                                  p.MaQuyen,
                                )}
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
                      <Button variant="outline">Huỷ</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        disabled={selectedPermissions.length === 0}>
                        Cấp Quyền
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {isAdmin && (
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleOpenEdit();
                    }}>
                    Sửa Vai Trò
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>Sửa vai trò</DialogTitle>
                      <DialogDescription>
                        Nhập thông tin mới và Lưu thay đổi để lưu.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="TenVaiTro">Tên Vai trò</Label>
                        <Input
                          id="TenVaiTro"
                          name="TenVaiTro"
                          value={formData.TenVaiTro}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              TenVaiTro: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Huỷ</Button>
                      </DialogClose>
                      <Button type="submit" disabled={!formData.TenVaiTro}>
                        Lưu thay đổi
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {isAdmin && (
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleOpenChangePermission();
                    }}>
                    Thay đổi Quyền
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={handleChangePermission} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>Thay đổi Quyền</DialogTitle>
                      <DialogDescription>
                        Chọn quyền cũ và quyền mới để thay đổi
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>Quyền hiện tại</Label>
                        <Select value={oldQuyen} onValueChange={setOldQuyen}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quyền hiện tại" />
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
                        <Label>Quyền mới</Label>
                        <Select value={newQuyen} onValueChange={setNewQuyen}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quyền mới" />
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
                        <Button variant="outline">Huỷ</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" disabled={!oldQuyen || !newQuyen}>
                          Thay đổi
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
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => {
                          e.preventDefault();
                          handleOpenDeletePermissions();
                        }}>
                        Xoá Từng Quyền
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-sm"
                      showCloseButton={false}>
                      <DialogHeader>
                        <DialogTitle>Lựa chọn Quyền bạn muốn xoá</DialogTitle>
                        <DialogDescription>
                          Tích chọn quyền và bấm Xoá để xoá quyền được chọn
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        {rol.permissions.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            Vai trò chưa có quyền nào
                          </p>
                        ) : (
                          rol.permissions.map((perm) => (
                            <Field
                              key={perm.MaQuyen}
                              className="flex items-center justify-between">
                              <Label>
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.includes(
                                    perm.MaQuyen,
                                  )}
                                  onChange={() =>
                                    togglePermission(perm.MaQuyen)
                                  }
                                />
                                {perm.TenQuyen}
                              </Label>
                            </Field>
                          ))
                        )}
                      </FieldGroup>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Huỷ</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            disabled={selectedPermissions.length === 0}
                            onClick={handleDeleteSelected}>
                            Xoá các quyền đã chọn
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => e.preventDefault()}>
                        Xoá tất cả Quyền
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-sm"
                      showCloseButton={false}>
                      <DialogHeader>
                        <DialogTitle>Xoá tất cả Quyền</DialogTitle>
                        <DialogDescription>
                          Bấm xoá để xoá tất cả quyền được cấp
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <Label htmlFor="MaVT">
                            Bạn có muốn xoá tất cả quyền được cấp hay không?
                          </Label>
                        </Field>
                      </FieldGroup>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Huỷ</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={async () =>
                              await deleteAllGrantPermissions(rol.MaVT)
                            }>
                            Xoá
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </>
            )}
            {isAdmin && (
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(e) => e.preventDefault()}>
                      Xoá Vai trò
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-sm"
                    showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>Xoá Vai Trò</DialogTitle>
                      <DialogDescription>
                        Để Xoá vai trò bạn phải xoá quyền trước
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="MaVT">
                          Bạn có muốn xoá Mã Vai Trò {rol.MaVT} -{" "}
                          {rol.TenVaiTro}
                        </Label>
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Huỷ</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={async () => await deleteRole(rol.MaVT)}>
                          Xoá
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
}
