import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

describe('Payroll Controllers', () => {
  let payRollControllers;
  let payRollMock;

  beforeEach(async () => {
    jest.resetModules();
    payRollMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn()
    };
    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      BangLuong: payRollMock,
      TaiKhoan: {}, VaiTro: {}, NhanVien: {}, GioLam: {}, KhauTru: {}, LuongCoBan: {}, PhuCap: {}
    }));
    const mod = await import('../../../src/controllers/payroll/payRollController.js');
    payRollControllers = mod;
  });

  test('getAllPayRolls', async () => {
    const req = mockRequest();
    const res = mockResponse();
    payRollMock.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    await payRollControllers.getPayrolls(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
