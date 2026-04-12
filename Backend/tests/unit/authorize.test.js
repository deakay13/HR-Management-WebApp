import { jest } from '@jest/globals';

describe('authorize middleware', () => {
  let authorize;

  beforeAll(async () => {
    const mod = await import('../../src/middlewares/authorize.js');
    authorize = mod.authorize;
  });

  function createMockReqResNext(permissions = []) {
    const req = { account: { permissions } };
    const res = {
      _statusCode: null,
      _json: null,
      status(code) { this._statusCode = code; return this; },
      json(data) { this._json = data; return this; },
    };
    const next = jest.fn();
    return { req, res, next };
  }

  test('cho phép khi có đủ quyền', () => {
    const { req, res, next } = createMockReqResNext(['Đọc', 'Tạo']);
    const middleware = authorize(['Đọc']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('từ chối 403 khi thiếu quyền', () => {
    const { req, res, next } = createMockReqResNext(['Đọc']);
    const middleware = authorize(['Xoá']);
    middleware(req, res, next);
    expect(res._statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('từ chối khi không có quyền nào', () => {
    const { req, res, next } = createMockReqResNext([]);
    const middleware = authorize(['Đọc']);
    middleware(req, res, next);
    expect(res._statusCode).toBe(403);
  });

  test('cho phép khi yêu cầu nhiều quyền và đều có', () => {
    const { req, res, next } = createMockReqResNext(['Đọc', 'Tạo', 'Sửa']);
    const middleware = authorize(['Đọc', 'Tạo']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('từ chối khi thiếu 1 trong nhiều quyền được yêu cầu', () => {
    const { req, res, next } = createMockReqResNext(['Đọc']);
    const middleware = authorize(['Đọc', 'Xoá']);
    middleware(req, res, next);
    expect(res._statusCode).toBe(403);
  });
});
