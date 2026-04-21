import api from "@/lib/axios";

export const PayRollServices = {
    getPayRolls: async () => {
        const res = await api.get("/api/payroll/payrolls", {
            params: { size: 0 },
            withCredentials: true,
        });
        return res.data;
    },
    deletePayRoll: async (ID: string) => {
        await api.delete(`/api/payroll/payrolls/${ID}`, { withCredentials: true,});
        return true;
    },
     updatePayRoll: async (ID: string, payRollData: Record<string, unknown>) => {
        const res = await api.put(`/api/payroll/payrolls/${ID}`, payRollData, {
            withCredentials: true,
        });
        return res.data.payroll;
        },
    createPayRoll: async (payRollData: Record<string, unknown>) => {
        const res = await api.post(`/api/payroll/payrolls`, payRollData, {
            withCredentials: true,
        });
        return res.data.payroll;
        },
    searchPayRolls: async (params: Record<string, unknown>) => {
    const res = await api.get("/api/payroll/payrolls/search", {
        params,
        withCredentials: true,
    });
    return res.data;
},
    exportPayRoll: async () => {
        const res = await api.get("/api/payroll/payrolls/export", {
            responseType: "blob",
            withCredentials: true,
        });
        return res.data;
    },
    getPayrollByEmployee: async (MaNV: string) => {
        const res = await api.get(`/api/payroll/payrolls/employee/${MaNV}`, {
            withCredentials: true,
        });
        return res.data;
    },
};
