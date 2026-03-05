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
// import {
//     assignPermission,
//     getRolePermissions,
//     removeRolePermission,
// } from "../controllers/Permission/rolePermissionControllers.js";

const router = express.Router();

//router Role
router.post("/roles", createRole);
router.get("/roles", getRoles);
router.get("/roles/:ID", getRolesById);
router.put("/roles/:ID", updateRole);
router.delete("/roles/:ID", deleteRole);

//router permissions
router.post("/permission", createPermission);
router.get("/permission", getPermissions);
router.get("/permission/:ID", getPermissionsById);
router.put("/permission/:ID", updatePermission);
router.delete("/permission/:ID", deletePermission);

//router RolePermissions
// router.post("/role-permissions", assignPermission);
// router.get("/role-permissions", getRolePermissions);
// router.delete("/role-permissions/:id", removeRolePermission);

export default router;