export interface Hours {
    MaGl: string;
    SoGioLam: number;
}
export interface HoursTypes {
    Hours: Hours[];
    initializing: boolean;
    clearState: () => void;
    getHours: () => Promise<void>;
}
