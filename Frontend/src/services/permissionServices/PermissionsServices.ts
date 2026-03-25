import api from "@/lib/axios";
import type { Permission } from "@/types/permissionTypes/PermissionsTypes";

export const PermissionsServices = {
    createPermissions: async (PermisionData: Permission) => {
        const res = await api.post("/api/permissions/permission",PermisionData, {
            withCredentials: true,
        });
        return res.data;
    },
    getPermissions: async () => {
        const res = await api.get("/api/permissions/permission", {
        params: { size: 0 },
        withCredentials: true,
        });
        return res.data.data;
    },
    updatePermissions: async (ID: string, PermisionData: Permission) => {
        const res = await api.put(`/api/permissions/permission/${ID}`,PermisionData, {
            withCredentials: true,
        });
        return res.data;
    },
    deletePermission: async (ID: string) => {
        await api.delete(`/api/permissions/permission/${ID}`, { withCredentials: true,});
        return true;
    },
};
