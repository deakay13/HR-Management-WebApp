import { describe, test, expect } from "vitest";
import {
  roleFromMaVT,
  normalizePermissions,
  hasRole,
  hasPermission,
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  canWrite,
  ROLE_ADMIN,
  ROLE_HR,
  ROLE_EMPLOYEE,
} from "@/utils/authorizeUtiles";

describe("roleFromMaVT", () => {
  test("VT001 → Quản Trị Viên", () => {
    const role = roleFromMaVT("VT001");
    expect(role).toEqual({ MaVT: "VT001", TenVaiTro: ROLE_ADMIN });
  });

  test("VT002 → Nhân Sự", () => {
    const role = roleFromMaVT("VT002");
    expect(role).toEqual({ MaVT: "VT002", TenVaiTro: ROLE_HR });
  });

  test("VT003 → Nhân Viên", () => {
    const role = roleFromMaVT("VT003");
    expect(role).toEqual({ MaVT: "VT003", TenVaiTro: ROLE_EMPLOYEE });
  });

  test("mã không hợp lệ → null", () => {
    expect(roleFromMaVT("VT999")).toBeNull();
    expect(roleFromMaVT(null)).toBeNull();
    expect(roleFromMaVT(undefined)).toBeNull();
  });
});

describe("normalizePermissions", () => {
  test("mảng string → Permission[]", () => {
    const result = normalizePermissions(["Đọc", "Tạo"]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ MaQuyen: "AUTO_0", TenQuyen: "Đọc" });
    expect(result[1]).toEqual({ MaQuyen: "AUTO_1", TenQuyen: "Tạo" });
  });

  test("mảng object có đủ MaQuyen+TenQuyen", () => {
    const input = [
      { MaQuyen: "Q001", TenQuyen: "Đọc" },
      { MaQuyen: "Q002", TenQuyen: "Tạo" },
    ];
    const result = normalizePermissions(input);
    expect(result).toEqual(input);
  });

  test("object chỉ có TenQuyen → tự tạo MaQuyen", () => {
    const result = normalizePermissions([{ TenQuyen: "Xoá" }]);
    expect(result[0].MaQuyen).toBe("AUTO_0");
    expect(result[0].TenQuyen).toBe("Xoá");
  });

  test("input không phải mảng → []", () => {
    expect(normalizePermissions(null)).toEqual([]);
    expect(normalizePermissions(undefined)).toEqual([]);
    expect(normalizePermissions("string")).toEqual([]);
    expect(normalizePermissions(123)).toEqual([]);
  });

  test("bỏ qua item không hợp lệ", () => {
    const result = normalizePermissions([
      "Đọc",
      123,
      null,
      { TenQuyen: "Tạo" },
    ]);
    expect(result).toHaveLength(2);
  });
});

describe("hasRole", () => {
  test("đúng vai trò → true", () => {
    expect(hasRole({ MaVT: "VT001", TenVaiTro: ROLE_ADMIN }, ROLE_ADMIN)).toBe(
      true,
    );
  });

  test("sai vai trò → false", () => {
    expect(
      hasRole({ MaVT: "VT003", TenVaiTro: ROLE_EMPLOYEE }, ROLE_ADMIN),
    ).toBe(false);
  });

  test("role null → false", () => {
    expect(hasRole(null, ROLE_ADMIN)).toBe(false);
  });
});

describe("hasPermission", () => {
  const perms = [
    { MaQuyen: "Q001", TenQuyen: "Đọc" },
    { MaQuyen: "Q002", TenQuyen: "Tạo" },
  ];

  test("có quyền → true", () => {
    expect(hasPermission(perms, "Đọc")).toBe(true);
  });

  test("không có quyền → false", () => {
    expect(hasPermission(perms, "Xoá")).toBe(false);
  });

  test("mảng rỗng → false", () => {
    expect(hasPermission([], "Đọc")).toBe(false);
  });
});

describe("CRUD permission helpers", () => {
  const allPerms = [
    { MaQuyen: "1", TenQuyen: "Tạo" },
    { MaQuyen: "2", TenQuyen: "Đọc" },
    { MaQuyen: "3", TenQuyen: "Sửa" },
    { MaQuyen: "4", TenQuyen: "Xoá" },
  ];
  const readOnly = [{ MaQuyen: "2", TenQuyen: "Đọc" }];

  test("canCreate", () => {
    expect(canCreate(allPerms)).toBe(true);
    expect(canCreate(readOnly)).toBe(false);
  });

  test("canRead", () => {
    expect(canRead(allPerms)).toBe(true);
    expect(canRead(readOnly)).toBe(true);
  });

  test("canUpdate", () => {
    expect(canUpdate(allPerms)).toBe(true);
    expect(canUpdate(readOnly)).toBe(false);
  });

  test("canDelete", () => {
    expect(canDelete(allPerms)).toBe(true);
    expect(canDelete(readOnly)).toBe(false);
  });

  test("canWrite - có quyền ghi", () => {
    expect(canWrite(allPerms)).toBe(true);
  });

  test("canWrite - chỉ đọc", () => {
    expect(canWrite(readOnly)).toBe(false);
  });
});
