import api from "@/lib/axios";

export const RolesServices = {

  getRoles: async () => {
    const res = await api.get("/api/permissions/roles", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
};
