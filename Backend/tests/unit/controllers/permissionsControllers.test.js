import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Permissions (Quyen) Controllers.
 * Covers all CRUD operations with validation, duplicate checks, 400/404/500 error handling.
 */
describe('Permissions Controllers', () => {
  let permissionsControllers;
  let quyenMock;
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    quyenMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/auth/Quyen.js', () => ({ default: quyenMock }));
    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({ Pagination: paginationMock }));

    const mod = await import('../../../src/controllers/permission/permissionsControllers.js');
    permissionsControllers = mod;
  });

  // ─────────────────────────────────────────────
  // getPermissions
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getPermissions (paginated list)
   */
  describe('getPermissions', () => {
    /**
     * @description Should return 200 with paginated permissions.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      quyenMock.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ MaQuyen: 'MQ001' }] });

      await permissionsControllers.getPermissions(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [{ MaQuyen: 'MQ001' }] }));
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
      quyenMock.findAndCountAll.mockResolvedValue({ count: 3, rows: [] });

      await permissionsControllers.getPermissions(req, res);
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
      quyenMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await permissionsControllers.getPermissions(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // getPermissionsById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getPermissionsById
   */
  describe('getPermissionsById', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await permissionsControllers.getPermissionsById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when permission is found.
     * @input req.params.ID = 'MQ001'
     * @output Status 200
     */
    test('returns 200 when record found', async () => {
      const req = mockRequest({ params: { ID: 'MQ001' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue({ MaQuyen: 'MQ001', TenQuyen: 'Read' });

      await permissionsControllers.getPermissionsById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 404 when permission is not found.
     * @input req.params.ID = 'MQ999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'MQ999' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue(null);

      await permissionsControllers.getPermissionsById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'MQ001' } });
      const res = mockResponse();
      quyenMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await permissionsControllers.getPermissionsById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createPermission
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createPermission
   */
  describe('createPermission', () => {
    /**
     * @description Should return 400 when validation fails (invalid MaQuyen format).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await permissionsControllers.createPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when MaQuyen already exists.
     * @input Valid body but MaQuyen already in DB
     * @output Status 400
     */
    test('returns 400 when MaQuyen already exists', async () => {
      const req = mockRequest({ body: { MaQuyen: 'MQ001', TenQuyen: 'Read Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue({ MaQuyen: 'MQ001' }); // Exists

      await permissionsControllers.createPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when TenQuyen already exists.
     * @input Valid body but TenQuyen already in DB
     * @output Status 400
     */
    test('returns 400 when TenQuyen already exists', async () => {
      const req = mockRequest({ body: { MaQuyen: 'MQ001', TenQuyen: 'Read Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue(null);
      quyenMock.findOne.mockResolvedValue({ TenQuyen: 'Read Data' }); // Name exists

      await permissionsControllers.createPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 201 when permission is created successfully.
     * @input Valid body with unique MaQuyen and TenQuyen
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaQuyen: 'MQ001', TenQuyen: 'Read Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue(null);
      quyenMock.findOne.mockResolvedValue(null);
      quyenMock.create.mockResolvedValue({ MaQuyen: 'MQ001', TenQuyen: 'Read Data' });

      await permissionsControllers.createPermission(req, res);
      expect(quyenMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected error', async () => {
      const req = mockRequest({ body: { MaQuyen: 'MQ001', TenQuyen: 'Read Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockRejectedValue(new Error('System error'));

      await permissionsControllers.createPermission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updatePermission
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updatePermission
   */
  describe('updatePermission', () => {
    /**
     * @description Should return 400 when validation fails (empty TenQuyen).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ params: { ID: 'MQ001' }, body: {} });
      const res = mockResponse();

      await permissionsControllers.updatePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when permission to update is not found.
     * @input Valid body, but ID not in DB
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'MQ999' }, body: { TenQuyen: 'Write Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue(null);

      await permissionsControllers.updatePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 400 when TenQuyen already exists in a different permission.
     * @input Valid ID, but new TenQuyen belongs to another record
     * @output Status 400
     */
    test('returns 400 when TenQuyen exists in another record', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'MQ001' }, body: { TenQuyen: 'Write Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue({ MaQuyen: 'MQ001', update: updateFn });
      quyenMock.findOne.mockResolvedValue({ MaQuyen: 'MQ002' }); // Different record with same name

      await permissionsControllers.updatePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when permission is updated successfully.
     * @input Valid ID and payload, no name conflict
     * @output Status 200
     */
    test('returns 200 when updated successfully', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'MQ001' }, body: { TenQuyen: 'Write Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue({ MaQuyen: 'MQ001', update: updateFn });
      quyenMock.findOne.mockResolvedValue(null); // No conflict

      await permissionsControllers.updatePermission(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'MQ001' }, body: { TenQuyen: 'Write Data' } });
      const res = mockResponse();
      quyenMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await permissionsControllers.updatePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deletePermission
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deletePermission
   */
  describe('deletePermission', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await permissionsControllers.deletePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when permission is not found.
     * @input req.params.ID = 'MQ999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'MQ999' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue(null);

      await permissionsControllers.deletePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when permission is deleted successfully.
     * @input Valid ID
     * @output Status 200
     */
    test('returns 200 when deleted successfully', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'MQ001' } });
      const res = mockResponse();
      quyenMock.findByPk.mockResolvedValue({ MaQuyen: 'MQ001', destroy: mockDestroy });

      await permissionsControllers.deletePermission(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'MQ001' } });
      const res = mockResponse();
      quyenMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await permissionsControllers.deletePermission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
