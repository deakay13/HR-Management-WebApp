import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

describe('Contract Controllers', () => {
  let contractControllers;
  let contractMock;
  let employeeMock;

  beforeEach(async () => {
    jest.resetModules();

    contractMock = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
    employeeMock = {
      findByPk: jest.fn()
    };

    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      HopDong: contractMock,
      NhanVien: employeeMock
    }));

    const mod = await import('../../../src/controllers/information/contractControllers.js');
    contractControllers = mod;
  });

  describe('getAllContracts', () => {
    test('trả về 200 và dùng where: { MaNV } nếu không phải Admin/HR', async () => {
      const req = mockRequest({ account: { MaNV: 'NV01', VaiTro: { TenVaiTro: 'Nhân Viên' } } });
      const res = mockResponse();
      
      contractMock.findAll.mockResolvedValue([{ MaHopDong: 'HD01' }]);

      await contractControllers.getAllContracts(req, res);
      
      expect(contractMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { MaNV: 'NV01' }
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ MaHopDong: 'HD01' }]);
    });

    test('trả về 200 và không bị giới hạn MaNV nếu là Quản Trị Viên', async () => {
      const req = mockRequest({ account: { MaNV: 'NV99', VaiTro: { TenVaiTro: 'Quản Trị Viên' } } });
      const res = mockResponse();
      
      contractMock.findAll.mockResolvedValue([{ MaHopDong: 'HD01' }, { MaHopDong: 'HD02' }]);

      await contractControllers.getAllContracts(req, res);
      
      expect(contractMock.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: {}
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    test('trả về 500 nếu có lỗi khi lấy danh sách', async () => {
      const req = mockRequest({ account: { MaNV: 'NV01', VaiTro: { TenVaiTro: 'Nhân Viên' } } });
      const res = mockResponse();
      
      contractMock.findAll.mockRejectedValue(new Error('Database Error'));

      await contractControllers.getAllContracts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Database Error') }));
    });
  });

  describe('getContractById', () => {
    test('trả về 200 nếu tìm thấy hợp đồng', async () => {
      const req = mockRequest({ params: { id: 'HD01' } });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue({ MaHopDong: 'HD01' });

      await contractControllers.getContractById(req, res);

      expect(contractMock.findByPk).toHaveBeenCalledWith('HD01', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ MaHopDong: 'HD01' });
    });

    test('trả về 404 nếu không tìm thấy hợp đồng', async () => {
      const req = mockRequest({ params: { id: 'HD01' } });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue(null);

      await contractControllers.getContractById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hợp đồng không tồn tại' });
    });

    test('trả về 500 nếu có lỗi', async () => {
      const req = mockRequest({ params: { id: 'HD01' } });
      const res = mockResponse();

      contractMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await contractControllers.getContractById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createContract', () => {
    test('trả về 400 nếu nhân viên không tồn tại', async () => {
      const req = mockRequest({ body: { MaNV: 'NV_INVALID' } });
      const res = mockResponse();
      
      employeeMock.findByPk.mockResolvedValue(null);

      await contractControllers.createContract(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('tạo hợp đồng thành công trả về 201 với đầy đủ 7 trường mới', async () => {
      const req = mockRequest({ 
        body: { 
          MaNV: 'NV01', 
          MaHopDong: 'HD01',
          LoaiHD: 'Có thời hạn',
          NgayBatDau: '2026-01-01',
          NgayKetThuc: '2027-01-01',
          NgayKy: '2025-12-30',
          ChucDanh: 'Nhân viên',
          MaPB: 'PB01',
          MaLCB: 'LCB01',
          MaPC: 'PC01',
          HinhThucTraLuong: 'Chuyển khoản',
          TinhTrang: 'Còn hiệu lực'
        } 
      });
      const res = mockResponse();
      
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01' });
      contractMock.create.mockResolvedValue({ MaHopDong: 'HD01' });

      await contractControllers.createContract(req, res);
      
      expect(contractMock.create).toHaveBeenCalledWith(expect.objectContaining({
        MaHopDong: 'HD01',
        MaNV: 'NV01',
        NgayKy: '2025-12-30',
        ChucDanh: 'Nhân viên',
        MaPB: 'PB01',
        MaLCB: 'LCB01',
        MaPC: 'PC01',
        HinhThucTraLuong: 'Chuyển khoản',
        TinhTrang: 'Còn hiệu lực'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('trả về 400 nếu có lỗi khi tạo', async () => {
      const req = mockRequest({ body: {
        MaHopDong: 'HD99',
        MaNV: 'NV01',
        LoaiHD: 'Có thời hạn',
        NgayBatDau: '2026-01-01'
      } });
      const res = mockResponse();
      
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01' });
      contractMock.create.mockRejectedValue(new Error('Validation Error'));

      await contractControllers.createContract(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Validation Error') }));
    });
  });

  describe('updateContract', () => {
    test('trả về 404 nếu hợp đồng không tồn tại', async () => {
      const req = mockRequest({ params: { id: 'HD_INVALID' } });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue(null);

      await contractControllers.updateContract(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hợp đồng không tồn tại' });
    });

    test('trả về 400 nếu MaNV mới không tồn tại', async () => {
      const req = mockRequest({ params: { id: 'HD01' }, body: { MaNV: 'NV_INVALID' } });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue({ MaHopDong: 'HD01', update: jest.fn() });
      employeeMock.findByPk.mockResolvedValue(null);

      await contractControllers.updateContract(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mã nhân viên không tồn tại' });
    });

    test('cập nhật hợp đồng thành công trả về 200 (bao gồm các trường mới)', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ 
        params: { id: 'HD01' }, 
        body: { 
          MaNV: 'NV01',
          ChucDanh: 'Trưởng phòng',
          TinhTrang: 'Hết hiệu lực'
        } 
      });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue({ MaHopDong: 'HD01', update: updateFn });
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01' });

      await contractControllers.updateContract(req, res);

      expect(updateFn).toHaveBeenCalledWith(expect.objectContaining({
        MaNV: 'NV01',
        ChucDanh: 'Trưởng phòng',
        TinhTrang: 'Hết hiệu lực'
      }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('trả về 400 nếu có lỗi khi cập nhật', async () => {
      const req = mockRequest({ params: { id: 'HD01' }, body: { } });
      const res = mockResponse();

      contractMock.findByPk.mockRejectedValue(new Error('Update Error'));

      await contractControllers.updateContract(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteContract', () => {
    test('trả về 404 nếu hợp đồng không tồn tại', async () => {
      const req = mockRequest({ params: { id: 'HD_INVALID' } });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue(null);

      await contractControllers.deleteContract(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('xóa thành công trả về 200', async () => {
      const destroyFn = jest.fn();
      const req = mockRequest({ params: { id: 'HD01' } });
      const res = mockResponse();

      contractMock.findByPk.mockResolvedValue({ MaHopDong: 'HD01', destroy: destroyFn });

      await contractControllers.deleteContract(req, res);

      expect(destroyFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('trả về 500 nếu có lỗi khi xóa', async () => {
      const req = mockRequest({ params: { id: 'HD01' } });
      const res = mockResponse();

      contractMock.findByPk.mockRejectedValue(new Error('Delete Error'));

      await contractControllers.deleteContract(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
