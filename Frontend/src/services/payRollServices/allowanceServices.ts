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
    updateAllowance: async (ID: string, allowanceData: any) => {
    const res = await api.put(`/api/payroll/allowances/${ID}`, allowanceData, {
        withCredentials: true,
    });
    return res.data.data;
    },
    createAllowance: async (allowanceData: any) => {
    const res = await api.post(`/api/payroll/allowances`, allowanceData, {
        withCredentials: true,
    });
    return res.data.data;
    },
    getAllowanceByID: async (ID: string) => {
        const res = await api.get(`/api/payroll/allowances/${ID}`, { withCredentials: true,});
        return res.data.data;
    },
};
