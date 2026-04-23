import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Allowance (PhuCap) Controllers.
 * Covers all CRUD operations with validation, 404, and 500 error handling.
 */
describe('Allowance Controllers', () => {
  let allowanceController;
  let phuCapMock;
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    phuCapMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/salary/PhuCap.js', () => ({
      default: phuCapMock,
    }));

    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({
      Pagination: paginationMock,
    }));

    const mod = await import('../../../src/controllers/payroll/allowanceController.js');
    allowanceController = mod;
  });

  // ─────────────────────────────────────────────
  // getAllowances
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getAllowances (list with pagination)
   */
  describe('getAllowances', () => {
    /**
     * @description Should return 200 with a paginated allowance list.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      phuCapMock.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ MaPC: 'PC001' }] });

      await allowanceController.getAllowances(req, res);

      expect(phuCapMock.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [{ MaPC: 'PC001' }] }));
    });

    /**
     * @description Should return 500 when a database error occurs.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      phuCapMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await allowanceController.getAllowances(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // getAllowanceById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getAllowanceById
   */
  describe('getAllowanceById', () => {
    /**
     * @description Should return 200 when allowance is found by ID.
     * @input req.params.ID = 'PC001'
     * @output Status 200, allowance object
     */
    test('returns 200 when record found', async () => {
      const req = mockRequest({ params: { ID: 'PC001' } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue({ MaPC: 'PC001' });

      await allowanceController.getAllowanceById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ MaPC: 'PC001' });
    });

    /**
     * @description Should return 404 when allowance is not found.
     * @input req.params.ID = 'PC999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'PC999' } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue(null);

      await allowanceController.getAllowanceById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'PC001' } });
      const res = mockResponse();
      phuCapMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await allowanceController.getAllowanceById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createAllowance
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createAllowance
   */
  describe('createAllowance', () => {
    /**
     * @description Should return 400 when validation fails (missing/invalid fields).
     * @input req.body = {} (empty)
     * @output Status 400 with errors array
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await allowanceController.createAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when allowance code already exists.
     * @input Valid body, but MaPC already in DB
     * @output Status 400
     */
    test('returns 400 when MaPC already exists', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue({ MaPC: 'PC001' }); // Exists

      await allowanceController.createAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when allowance type already exists.
     * @input Valid body, but LoaiPC already in DB
     * @output Status 400
     */
    test('returns 400 when LoaiPC already exists', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue(null);
      phuCapMock.findOne.mockResolvedValue({ LoaiPC: 'Di chuyển' }); // Type exists

      await allowanceController.createAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 201 when allowance is created successfully.
     * @input Valid body with unique MaPC and LoaiPC
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue(null);
      phuCapMock.findOne.mockResolvedValue(null);
      phuCapMock.create.mockResolvedValue({ MaPC: 'PC001', LoaiPC: 'Di chuyển', SoTien: 500000 });

      await allowanceController.createAllowance(req, res);
      expect(phuCapMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected database error.
     * @input DB throws error during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected database error', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockRejectedValue(new Error('System error'));

      await allowanceController.createAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updateAllowance
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updateAllowance
   */
  describe('updateAllowance', () => {
    /**
     * @description Should return 400 when validation fails.
     * @input Invalid body (missing SoTien)
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ params: { ID: 'PC001' }, body: {} });
      const res = mockResponse();

      await allowanceController.updateAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when allowance to update is not found.
     * @input Valid body, but ID not in DB
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'PC999' }, body: { LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue(null);

      await allowanceController.updateAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when allowance is updated successfully.
     * @input Valid ID and valid payload
     * @output Status 200
     */
    test('returns 200 when updated successfully', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'PC001' }, body: { LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue({ MaPC: 'PC001', update: updateFn });

      await allowanceController.updateAllowance(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'PC001' }, body: { LoaiPC: 'Di chuyển', SoTien: 500000 } });
      const res = mockResponse();
      phuCapMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await allowanceController.updateAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deleteAllowance
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deleteAllowance
   */
  describe('deleteAllowance', () => {
    /**
     * @description Should return 404 when allowance is not found.
     * @input Invalid ID
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'PC999' } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue(null);

      await allowanceController.deleteAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when allowance is deleted successfully.
     * @input Valid ID
     * @output Status 200
     */
    test('returns 200 when deleted successfully', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'PC001' } });
      const res = mockResponse();
      phuCapMock.findByPk.mockResolvedValue({ MaPC: 'PC001', destroy: mockDestroy });

      await allowanceController.deleteAllowance(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'PC001' } });
      const res = mockResponse();
      phuCapMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await allowanceController.deleteAllowance(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
