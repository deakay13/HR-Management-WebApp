import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

describe('Role Permission Controllers', () => {
  let rolePermissionControllers;
  let quyenVaiTroMock;

  beforeEach(async () => {
    jest.resetModules();
    quyenVaiTroMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      destroy: jest.fn(),
      bulkCreate: jest.fn()
    };
    jest.unstable_mockModule('../../../src/models/auth/VaiTro_Quyen.js', () => ({ default: quyenVaiTroMock }));
    jest.unstable_mockModule('../../../src/models/auth/Quyen.js', () => ({ default: {} }));
    jest.unstable_mockModule('../../../src/models/auth/VaiTro.js', () => ({ default: { findAll: jest.fn().mockResolvedValue([]) } }));
    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      Quyen_VaiTro: quyenVaiTroMock, TaiKhoan: {}, VaiTro: {}, NhanVien: {}, sequelize: { transaction: jest.fn() }
    }));
    const mod = await import('../../../src/controllers/permission/rolePermissionControllers.js');
    rolePermissionControllers = mod;
  });

  test('getAllRolePermission', async () => {
    const req = mockRequest();
    const res = mockResponse();
    quyenVaiTroMock.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    await rolePermissionControllers.getPermission_Role(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
