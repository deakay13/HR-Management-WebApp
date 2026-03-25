import api from "@/lib/axios";

export const DeductionServices = {
    getDeductions: async () => {
        const res = await api.get("/api/payroll/deductions", {
            params: { size: 0 },
            withCredentials: true,
        });
        return res.data.data;
    },
    deleteDeduction: async (ID: string) => {
        await api.delete(`/api/payroll/deductions/${ID}`, { withCredentials: true,});
        return true;
    },
};
