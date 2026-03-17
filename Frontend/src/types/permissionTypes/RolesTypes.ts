export interface Role {
    MaVT: string;
    TenVaiTro: string;
}
export interface RolesTypes {
    Roles: Role[];
    initializing: boolean;
    clearState: () => void;
    getRoles: () => Promise<void>;
}
