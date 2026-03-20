export interface BaseSalary {
    MaLCB: string;
    LuongCB: number;
}
export interface BaseSalaryTypes {
    BaseSalaries: BaseSalary[];
    initializing: boolean;
    clearState: () => void;
    getBaseSalaries: () => Promise<void>;
}
