import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

describe('Current Account Controllers', () => {
  let currentAccountController;
  let accountMock;

  beforeEach(async () => {
    jest.resetModules();
    accountMock = {
      findOne: jest.fn(),
      update: jest.fn(),
      findByPk: jest.fn()
    };
    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      TaiKhoan: accountMock,
      VaiTro: {},
      NhanVien: {}
    }));
    const mod = await import('../../../src/controllers/users/currentAccount.js');
    currentAccountController = mod;
  });

  test('currentAccount', async () => {
    const req = mockRequest({ account: { MaTK: 'TK1' } });
    const res = mockResponse();
    accountMock.findOne.mockResolvedValue({ MaTK: 'TK1' });
    await currentAccountController.currentAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
