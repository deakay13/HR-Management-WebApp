export interface Allowance {
    MaPC: string;
    LoaiPC: string;
    SoTien: number;
}
export interface AllowanceTypes {
    Allowances: Allowance[];
    initializing: boolean;
    clearState: () => void;
    getAllowances: () => Promise<void>;
}
