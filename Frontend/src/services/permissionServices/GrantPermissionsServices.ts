import api from "@/lib/axios";
import type { AssignPermissionPayload } from "@/types/permissionTypes/GrantPermissionsTypes";

export const GrantPermissionsServices = {
    assigGrantPermissions: async (data: AssignPermissionPayload) => {
        const res = await api.post("/api/permissions/Permission_Role", data,
        {
            withCredentials: true,
        },
        );
        return res.data;
    },
    getGrantPermissions: async () => {
        const res = await api.get("/api/permissions/Permission_Role", {
        params: { size: 0 },
        withCredentials: true,
        });
        return res.data.data;
    },
    updateGrantPermissions: async (ID: string, payload: { MaVT: string; oldQuyen: string; newQuyen: string }) => {
        const res = await api.put(`/api/permissions/Permission_Role/${ID}`, payload,
            {
                withCredentials: true,
            },
        );
        return res.data;
    },
    deleteAllGrantPermissions: async (ID: string) => {
        await api.delete(`/api/permissions/Permission_Role/${ID}`, { withCredentials: true,});
        return true;
    },
    deleteOneGrantPermissions: async (IDR: string,IDP: string) => {
        const res = await api.delete(`/api/permissions/Permission_Role/${IDR}/${IDP}`, {withCredentials: true,});
        return res.data ;
    },
};