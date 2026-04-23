import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Role (VaiTro) Controllers.
 * Covers all CRUD operations with validation, duplicate checks, cascading delete
 * of VaiTro_Quyen, and 400/404/500 error handling.
 */
describe('Role Controllers', () => {
  let roleControllers;
  let vaiTroMock;
  let vaiTroQuyenMock;
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    vaiTroMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    vaiTroQuyenMock = {
      destroy: jest.fn().mockResolvedValue(1),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/auth/VaiTro.js', () => ({ default: vaiTroMock }));
    jest.unstable_mockModule('../../../src/models/auth/VaiTro_Quyen.js', () => ({ default: vaiTroQuyenMock }));
    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({ Pagination: paginationMock }));

    const mod = await import('../../../src/controllers/permission/roleControllers.js');
    roleControllers = mod;
  });

  // ─────────────────────────────────────────────
  // getRoles
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getRoles (paginated list)
   */
  describe('getRoles', () => {
    /**
     * @description Should return 200 with paginated roles.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      vaiTroMock.findAndCountAll.mockResolvedValue({ count: 2, rows: [{ MaVT: 'VT001' }, { MaVT: 'VT002' }] });

      await roleControllers.getRoles(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
    });

    /**
     * @description Should return 200 with totalPages=1 when limit is null.
     * @input Pagination limit=null
     * @output Status 200, totalPages=1
     */
    test('returns 200 with totalPages=1 when limit is null', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      paginationMock.mockReturnValue({ offset: 0, limit: null, page: 1, finalSize: 10 });
      vaiTroMock.findAndCountAll.mockResolvedValue({ count: 2, rows: [] });

      await roleControllers.getRoles(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ totalPages: 1 }));
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      vaiTroMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await roleControllers.getRoles(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // getRolesById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getRolesById
   */
  describe('getRolesById', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await roleControllers.getRolesById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when role is found.
     * @input req.params.ID = 'VT001'
     * @output Status 200
     */
    test('returns 200 when record found', async () => {
      const req = mockRequest({ params: { ID: 'VT001' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue({ MaVT: 'VT001', TenVaiTro: 'Admin' });

      await roleControllers.getRolesById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 404 when role is not found.
     * @input req.params.ID = 'VT999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'VT999' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue(null);

      await roleControllers.getRolesById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'VT001' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await roleControllers.getRolesById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createRole
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createRole
   */
  describe('createRole', () => {
    /**
     * @description Should return 400 when validation fails (invalid MaVT format).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await roleControllers.createRole(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when MaVT already exists.
     * @input Valid body but MaVT already in DB
     * @output Status 400
     */
    test('returns 400 when MaVT already exists', async () => {
      const req = mockRequest({ body: { MaVT: 'VT001', TenVaiTro: 'Manager' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue({ MaVT: 'VT001' }); // Exists

      await roleControllers.createRole(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when TenVaiTro already exists.
     * @input Valid body but TenVaiTro already in DB
     * @output Status 400
     */
    test('returns 400 when TenVaiTro already exists', async () => {
      const req = mockRequest({ body: { MaVT: 'VT001', TenVaiTro: 'Manager' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue(null);
      vaiTroMock.findOne.mockResolvedValue({ TenVaiTro: 'Manager' }); // Name exists

      await roleControllers.createRole(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 201 when role is created successfully.
     * @input Valid body with unique MaVT and TenVaiTro
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaVT: 'VT001', TenVaiTro: 'Manager' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue(null);
      vaiTroMock.findOne.mockResolvedValue(null);
      vaiTroMock.create.mockResolvedValue({ MaVT: 'VT001', TenVaiTro: 'Manager' });

      await roleControllers.createRole(req, res);
      expect(vaiTroMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected error', async () => {
      const req = mockRequest({ body: { MaVT: 'VT001', TenVaiTro: 'Manager' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockRejectedValue(new Error('System error'));

      await roleControllers.createRole(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updateRole
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updateRole
   */
  describe('updateRole', () => {
    /**
     * @description Should return 400 when validation fails (short TenVaiTro).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ params: { ID: 'VT001' }, body: {} });
      const res = mockResponse();

      await roleControllers.updateRole(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when role to update is not found.
     * @input Valid body, but ID not in DB
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'VT999' }, body: { TenVaiTro: 'New Role' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue(null);

      await roleControllers.updateRole(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when role is updated successfully.
     * @input Valid ID and payload
     * @output Status 200
     */
    test('returns 200 when updated successfully', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'VT001' }, body: { TenVaiTro: 'New Role' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue({ MaVT: 'VT001', update: updateFn });

      await roleControllers.updateRole(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'VT001' }, body: { TenVaiTro: 'New Role' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await roleControllers.updateRole(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deleteRole
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deleteRole
   */
  describe('deleteRole', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await roleControllers.deleteRole(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when role is not found.
     * @input req.params.ID = 'VT999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'VT999' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue(null);

      await roleControllers.deleteRole(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should cascade-delete VaiTro_Quyen and return 200.
     * @input Valid ID
     * @output Status 200, VaiTro_Quyen.destroy called first
     */
    test('returns 200, cascades delete of VaiTro_Quyen first', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'VT001' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockResolvedValue({ MaVT: 'VT001', destroy: mockDestroy });

      await roleControllers.deleteRole(req, res);
      expect(vaiTroQuyenMock.destroy).toHaveBeenCalledWith({ where: { MaVT: 'VT001' } });
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'VT001' } });
      const res = mockResponse();
      vaiTroMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await roleControllers.deleteRole(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
