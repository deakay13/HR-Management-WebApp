import api from '@/lib/axios'

export const authServices = {
    signIn: async (
        TenTaiKhoan: string,
        MatKhau: string,
    ) => {
        const res = await api.post(
            "/api/auth/signin",
            { TenTaiKhoan, MatKhau },
            { withCredentials: true },
        );
        return res.data;
    },

    signOut: async () => {
        return api.post('/api/auth/signout', {}, { withCredentials: true });
    }
};