import express from "express";
import {    createRole,
    getRoles,
    getRolesById,
    updateRole,
    deleteRole
} from "../controllers/Permission/roleControllers.js"
import {
    createPermission,
    getPermissions,
    getPermissionsById,
    updatePermission,
    deletePermission
} from "../controllers/Permission/permissionsControllers.js";
import { authorize } from '../middlewares/middlewareAuthorize.js';
import {
    assignPermission_Role,
    getPermission_Role,
    getPermission_RoleById,
    updatePermission_Role,
    deleteAllPermission_Role,
    deletePermission_RoleOnePermission,
} from "../controllers/Permission/rolePermissionControllers.js";

const router = express.Router();

//router Role
router.post("/roles",authorize(["Tạo"]), createRole);
router.get("/roles",authorize(["Đọc"]), getRoles);
router.get("/roles/:ID",authorize(["Đọc"]), getRolesById);
router.put("/roles/:ID",authorize(["Sửa"]), updateRole);
router.delete("/roles/:ID",authorize(["Xoá"]), deleteRole);

//router permissions
router.post("/permission",authorize(["Tạo"]), createPermission);
router.get("/permission",authorize(["Đọc"]),getPermissions);
router.get("/permission/:ID",authorize(["Đọc"]), getPermissionsById);
router.put("/permission/:ID",authorize(["Sửa"]), updatePermission);
router.delete("/permission/:ID",authorize(["Xoá"]), deletePermission);

//router RolePermissions
router.post("/Permission_Role",authorize(["Tạo"]), assignPermission_Role);
router.get("/Permission_Role",authorize(["Đọc"]), getPermission_Role);
router.get("/Permission_Role/:ID",authorize(["Đọc"]), getPermission_RoleById);
router.put("/Permission_Role/:ID",authorize(["Sửa"]), updatePermission_Role);
router.delete("/Permission_Role/:IDR",authorize(["Xoá"]), deleteAllPermission_Role);
router.delete("/Permission_Role/:IDR/:IDP",authorize(["Xoá"]), deletePermission_RoleOnePermission);

export default router;