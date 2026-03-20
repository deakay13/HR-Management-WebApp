export interface Deduction {
    MaKT: string;
    LoaiKT: string;
    PhanTram: number;
}
export interface DeductionsTypes {
    Deductions: Deduction[];
    initializing: boolean;
    clearState: () => void;
    getDeductions: () => Promise<void>;
}
