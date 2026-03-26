export interface EmployeeReference {
  MaNV: string;
  TenNV?: string; 
}

export interface Contract {
  MaHopDong: string;
  MaNV: string;
  LoaiHD: string;
  NgayBatDau: string;
  NgayKetThuc: string; 
  HinhAnhHopDong?: string | null;
  NhanVien?: EmployeeReference;
}