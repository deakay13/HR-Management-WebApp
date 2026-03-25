import api from "@/lib/axios";
import type { Role } from "@/types/permissionTypes/RolesTypes";

export const RolesServices = {
  createRoles: async (RoleData: Role) => {
    const res = await api.post("/api/permissions/roles", RoleData, {
      withCredentials: true,
    });
    return res.data;
  },
  getRoles: async () => {
    const res = await api.get("/api/permissions/roles", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
  updateRoles: async (ID: string, RoleData: Role) => {
    const res = await api.put(`/api/permissions/roles/${ID}`, RoleData, {
      withCredentials: true,
    });
    return res.data;
  },
  deleteRole: async (ID: string) => {
    await api.delete(`/api/permissions/roles/${ID}`, { withCredentials: true });
    return true;
  },
};
