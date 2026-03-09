import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    clearState: () => void;
    signIn: (TenTaiKhoan: string, MatKhau: string) => Promise<void>;
    signOut: () => Promise<void>;
}