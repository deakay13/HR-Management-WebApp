import api from "@/lib/axios";

export const AllowanceServices = {
    getAllowances: async () => {
        const res = await api.get("/api/payroll/allowances", {
            params: { size: 0 },
            withCredentials: true,
        });
        return res.data.data;
    },
    deleteAllowance: async (ID: string) => {
        await api.delete(`/api/payroll/allowances/${ID}`, { withCredentials: true,});
        return true;
    },
};
