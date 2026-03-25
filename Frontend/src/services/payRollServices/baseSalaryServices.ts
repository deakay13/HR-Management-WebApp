import api from "@/lib/axios";

export const BaseSalaryServices = {
    getBaseSalaries: async () => {
        const res = await api.get("/api/payroll/basesalary", {
            params: { size: 0 },
            withCredentials: true,
        });
        return res.data.data;
    },
    deleteBaseSalary: async (ID: string) => {
        await api.delete(`/api/payroll/basesalary/${ID}`, { withCredentials: true,});
        return true;
    },
};
