import api from "@/lib/axios";

export const PermissionsServices = {
    getPermissions: async () => {
        const res = await api.get("/api/permissions/permission", {
        params: { size: 0 },
        withCredentials: true,
        });
        return res.data.data;
    },
    deletePermission: async (ID: string) => {
        await api.delete(`/api/permissions/permission/${ID}`, { withCredentials: true,});
        return true;
    },
};
