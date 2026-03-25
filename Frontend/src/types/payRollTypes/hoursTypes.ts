export interface Hours {
    MaGL: string;
    SoGioLam: number;
}
export interface HoursTypes {
    Hours: Hours[];
    initializing: boolean;
    clearState: () => void;
    getHours: () => Promise<void>;
}
