export interface PayRoll {
    MaBL: string;
    MaNV: string;
    MaLCB: string;
    MaPC: string;
    MaKT: string;
    MaGL: string;
    Thang: Date;
    NgayTinhLuong: string;
    TongLuong: number;
    TrangThai: string;
}
export interface PayRollTypes {
    PayRolls: PayRoll[];
    initializing: boolean;
    clearState: () => void;
    getPayRolls: () => Promise<void>;
}
