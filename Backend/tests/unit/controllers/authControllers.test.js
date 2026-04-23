import { jest } from '@jest/globals';
import { mockRequest, mockResponse, mockNext } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Auth Controllers
 */
describe('Auth Controllers', () => {
  let authControllers;
  let jwtMock;
  let bcryptMock;
  let cryptoMock;
  let taiKhoanMock;
  let sessionMock;

  beforeEach(async () => {
    jest.resetModules();

    jwtMock = {
      sign: jest.fn().mockReturnValue('mock-jwt-token')
    };
    jest.unstable_mockModule('jsonwebtoken', () => ({ default: jwtMock }));

    bcryptMock = {
      compare: jest.fn()
    };
    jest.unstable_mockModule('bcrypt', () => ({ default: bcryptMock }));

    cryptoMock = {
      randomBytes: jest.fn().mockReturnValue({ toString: () => 'mock-refresh-token' })
    };
    jest.unstable_mockModule('crypto', () => ({ default: cryptoMock }));

    taiKhoanMock = {
      findOne: jest.fn(),
      update: jest.fn()
    };
    sessionMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      destroy: jest.fn()
    };

    jest.unstable_mockModule('../../../src/models/auth/TaiKhoan.js', () => ({ default: taiKhoanMock }));
    jest.unstable_mockModule('../../../src/models/auth/Session.js', () => ({ default: sessionMock }));

    const mod = await import('../../../src/controllers/users/authControllers.js');
    authControllers = mod;
  });

  /**
   * @description Test suite for user sign in
   * @function signIn
   */
  describe('signIn', () => {
    /**
     * @description Should return status 400 if username or password is not provided.
     * @input Empty body request
     * @output Status 400
     */
    test('lỗi 400 nếu thiếu tài khoản hoặc mật khẩu', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      await authControllers.signIn(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return status 401 if account does not exist.
     * @input Non-existent username
     * @output Status 401
     */
    test('lỗi 401 nếu tài khoản không tồn tại', async () => {
      const req = mockRequest({ body: { TenTaiKhoan: 'user', MatKhau: 'pass' } });
      const res = mockResponse();
      taiKhoanMock.findOne.mockResolvedValue(null);
      await authControllers.signIn(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    /**
     * @description Should return status 401 if the password is incorrect.
     * @input Valid username but wrong password
     * @output Status 401
     */
    test('lỗi 401 nếu sai mật khẩu', async () => {
      const req = mockRequest({ body: { TenTaiKhoan: 'user', MatKhau: 'pass' } });
      const res = mockResponse();
      taiKhoanMock.findOne.mockResolvedValue({ TenTaiKhoan: 'user', MatKhau: 'hashed' });
      bcryptMock.compare.mockResolvedValue(false);
      await authControllers.signIn(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    /**
     * @description Should return status 500 if refresh token generation fails.
     * @input Valid credentials but crypto returns null
     * @output Status 500
     */
    test('lỗi 500 nếu không thể tạo refresh token', async () => {
      const req = mockRequest({ body: { TenTaiKhoan: 'user', MatKhau: 'pass' } });
      const res = mockResponse();
      taiKhoanMock.findOne.mockResolvedValue({ MaTK: 'TK001', TenTaiKhoan: 'user', MatKhau: 'hashed' });
      bcryptMock.compare.mockResolvedValue(true);
      cryptoMock.randomBytes.mockReturnValue({ toString: () => null }); // Simulate failure

      await authControllers.signIn(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    /**
     * @description Should return status 200, set a cookie, and provide an access token on success.
     * @input Valid username and password
     * @output Status 200, token string, and cookie header
     */
    test('đăng nhập thành công trả về 200 và set cookie', async () => {
      const req = mockRequest({ body: { TenTaiKhoan: 'user', MatKhau: 'pass' } });
      const res = mockResponse();
      
      taiKhoanMock.findOne.mockResolvedValue({ MaTK: 'TK001', TenTaiKhoan: 'user', MatKhau: 'hashed' });
      bcryptMock.compare.mockResolvedValue(true);

      await authControllers.signIn(req, res);

      expect(sessionMock.create).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
      expect(taiKhoanMock.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: 'mock-jwt-token'
      }));
    });

    /**
     * @description Should return status 500 on unexpected exception.
     * @input Unexpected DB error
     * @output Status 500
     */
    test('lỗi 500 khi có exception', async () => {
      const req = mockRequest({ body: { TenTaiKhoan: 'user', MatKhau: 'pass' } });
      const res = mockResponse();
      taiKhoanMock.findOne.mockRejectedValue(new Error('DB error'));
      await authControllers.signIn(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for user sign out
   * @function signOut
   */
  describe('signOut', () => {
    /**
     * @description Should return status 204, destroy session, and clear cookies when signed out with a valid token.
     * @input Valid refresh token in cookies
     * @output Status 204 and cleared cookie
     */
    test('return 204 và xóa cookie khi đăng xuất với valid refreshToken', async () => {
      const mockSession = { MaTK: 'TK001', destroy: jest.fn() };
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      
      sessionMock.findOne.mockResolvedValue(mockSession);
      
      await authControllers.signOut(req, res);
      
      expect(taiKhoanMock.update).toHaveBeenCalledWith({ TrangThai: 'Offline' }, { where: { MaTK: 'TK001' } });
      expect(mockSession.destroy).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    /**
     * @description Should return status 500 on unexpected exception during sign out.
     * @input Unexpected DB error
     * @output Status 500
     */
    test('lỗi 500 khi có exception', async () => {
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      sessionMock.findOne.mockRejectedValue(new Error('DB error'));
      await authControllers.signOut(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for refreshing the access token
   * @function refreshToken
   */
  describe('refreshToken', () => {
    /**
     * @description Should return status 401 if refresh token is not found in cookies.
     * @input No cookies
     * @output Status 401
     */
    test('401 nếu không có cookie', async () => {
      const req = mockRequest({ cookies: {} });
      const res = mockResponse();
      await authControllers.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    /**
     * @description Should return status 403 if session does not exist in DB for the token.
     * @input Invalid refresh token
     * @output Status 403
     */
    test('403 nếu session không tồn tại', async () => {
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      sessionMock.findOne.mockResolvedValue(null);
      await authControllers.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    /**
     * @description Should return status 404 if associated account is not found.
     * @input Token exists but account is deleted
     * @output Status 404
     */
    test('404 nếu không tìm thấy tài khoản', async () => {
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      sessionMock.findOne.mockResolvedValue({ MaTK: 'TK001' });
      taiKhoanMock.findOne.mockResolvedValue(null);
      await authControllers.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 403 if the session's expiry date has passed.
     * @input Expired token session
     * @output Status 403
     */
    test('403 nếu session hết hạn', async () => {
      const pastDate = new Date(Date.now() - 10000); // 10 giây trước
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      
      sessionMock.findOne.mockResolvedValue({ MaTK: 'TK001', expiresAt: pastDate });
      taiKhoanMock.findOne.mockResolvedValue({ MaTK: 'TK001' });

      await authControllers.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    /**
     * @description Should return status 200 and a new access token if the session is valid.
     * @input Valid refresh token and non-expired session
     * @output Status 200 and new JWT access token
     */
    test('200 và cấp token mới thành công', async () => {
      const futureDate = new Date(Date.now() + 10000);
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      
      sessionMock.findOne.mockResolvedValue({ MaTK: 'TK001', expiresAt: futureDate });
      taiKhoanMock.findOne.mockResolvedValue({ MaTK: 'TK001' });

      await authControllers.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'mock-jwt-token' });
    });

    /**
     * @description Should return status 500 on unexpected exception during token refresh.
     * @input Unexpected DB error
     * @output Status 500
     */
    test('lỗi 500 khi có exception', async () => {
      const req = mockRequest({ cookies: { refreshToken: 'mock-refresh-token' } });
      const res = mockResponse();
      sessionMock.findOne.mockRejectedValue(new Error('DB error'));
      await authControllers.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
