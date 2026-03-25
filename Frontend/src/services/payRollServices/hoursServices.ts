import api from "@/lib/axios";

export const HoursServices = {
    getHours: async () => {
        const res = await api.get("/api/payroll/hours", {
            params: { size: 0 },
            withCredentials: true,
        });
        return res.data.data;
    },
    deleteHour: async (ID: string) => {
        await api.delete(`/api/payroll/hours/${ID}`, { withCredentials: true,});
        return true;
    },
};
