import { jest } from '@jest/globals';
import { mockRequest, mockResponse, mockNext } from '../../utils/mockRequests.js';

describe('verifyJWT middleware', () => {
  let protectedRoute;
  let jwtVerifyMock;
  let findOneMock;

  beforeEach(async () => {
    jest.resetModules(); // Reset module cache before each test
    
    // Mock jsonwebtoken
    jwtVerifyMock = jest.fn();
    jest.unstable_mockModule('jsonwebtoken', () => ({
      default: {
        verify: jwtVerifyMock
      }
    }));

    // Mock models
    findOneMock = jest.fn();
    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      TaiKhoan: { findOne: findOneMock },
      VaiTro: {},
      Quyen: {},
      NhanVien: {}
    }));

    process.env.ACCESS_TOKEN_SECRET = 'test-secret';

    const mod = await import('../../../src/middlewares/verifyJWT.js');
    protectedRoute = mod.protectedRoute;
  });

  test('trả về 401 nếu không có token', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    await protectedRoute(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('trả về 403 nếu token sai', async () => {
    const req = mockRequest({ headers: { authorization: 'Bearer bad-token' } });
    const res = mockResponse();
    const next = mockNext();
    
    jwtVerifyMock.mockImplementation((token, secret, callback) => {
      callback(Object.assign(new Error(), { name: 'JsonWebTokenError' }), null);
    });

    await protectedRoute(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('trả về 404 nếu tài khoản không tồn tại', async () => {
    const req = mockRequest({ headers: { authorization: 'Bearer good-token' } });
    const res = mockResponse();
    const next = mockNext();
    
    jwtVerifyMock.mockImplementation((token, secret, callback) => {
      callback(null, { MaTK: 'TK001' });
    });

    findOneMock.mockResolvedValue(null);

    await protectedRoute(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('gọi next() và lưu req.account nếu thành công', async () => {
    const req = mockRequest({ headers: { authorization: 'Bearer good-token' } });
    const res = mockResponse();
    const next = mockNext();
    
    jwtVerifyMock.mockImplementation((token, secret, callback) => {
      callback(null, { MaTK: 'TK001' });
    });

    findOneMock.mockResolvedValue({
      toJSON: () => ({ MaTK: 'TK001', VaiTro: { Quyens: [{ TenQuyen: 'Đọc' }] } })
    });

    await protectedRoute(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.account).toBeDefined();
    expect(req.account.permissions).toContain('Đọc');
  });
});
