import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Deduction (KhauTru) Controllers.
 * Covers all CRUD operations with validation, duplicate checks, 404, and 500 error handling.
 */
describe('Deduction Controllers', () => {
  let deductionController;
  let khauTruMock;
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    khauTruMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/salary/KhauTru.js', () => ({
      default: khauTruMock,
    }));

    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({
      Pagination: paginationMock,
    }));

    const mod = await import('../../../src/controllers/payroll/deductionController.js');
    deductionController = mod;
  });

  // ─────────────────────────────────────────────
  // getDeductions
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getDeductions (paginated list)
   */
  describe('getDeductions', () => {
    /**
     * @description Should return 200 with paginated deductions.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      khauTruMock.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ MaKT: 'KT001' }] });

      await deductionController.getDeductions(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [{ MaKT: 'KT001' }] }));
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
      khauTruMock.findAndCountAll.mockResolvedValue({ count: 3, rows: [] });

      await deductionController.getDeductions(req, res);
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
      khauTruMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await deductionController.getDeductions(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // getDeductionById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getDeductionById
   */
  describe('getDeductionById', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await deductionController.getDeductionById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when deduction is found.
     * @input req.params.ID = 'KT001'
     * @output Status 200
     */
    test('returns 200 when record found', async () => {
      const req = mockRequest({ params: { ID: 'KT001' } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue({ MaKT: 'KT001' });

      await deductionController.getDeductionById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 404 when deduction is not found.
     * @input req.params.ID = 'KT999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'KT999' } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue(null);

      await deductionController.getDeductionById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'KT001' } });
      const res = mockResponse();
      khauTruMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await deductionController.getDeductionById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createDeduction
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createDeduction
   */
  describe('createDeduction', () => {
    /**
     * @description Should return 400 when validation fails (empty body).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await deductionController.createDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when MaKT already exists.
     * @input Valid body but MaKT already in DB
     * @output Status 400
     */
    test('returns 400 when MaKT already exists', async () => {
      const req = mockRequest({ body: { MaKT: 'KT001', LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue({ MaKT: 'KT001' }); // Exists

      await deductionController.createDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when LoaiKT already exists.
     * @input Valid body but LoaiKT already in DB
     * @output Status 400
     */
    test('returns 400 when LoaiKT already exists', async () => {
      const req = mockRequest({ body: { MaKT: 'KT001', LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue(null);
      khauTruMock.findOne.mockResolvedValue({ LoaiKT: 'BHXH' }); // Type exists

      await deductionController.createDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 201 when deduction is created successfully.
     * @input Valid body with unique MaKT and LoaiKT
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaKT: 'KT001', LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue(null);
      khauTruMock.findOne.mockResolvedValue(null);
      khauTruMock.create.mockResolvedValue({ MaKT: 'KT001', LoaiKT: 'BHXH', PhanTram: 8 });

      await deductionController.createDeduction(req, res);
      expect(khauTruMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected error', async () => {
      const req = mockRequest({ body: { MaKT: 'KT001', LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockRejectedValue(new Error('System error'));

      await deductionController.createDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updateDeduction
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updateDeduction
   */
  describe('updateDeduction', () => {
    /**
     * @description Should return 400 when validation fails (empty body).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ params: { ID: 'KT001' }, body: {} });
      const res = mockResponse();

      await deductionController.updateDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {} (no ID)
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {}, body: { LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();

      await deductionController.updateDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when deduction to update is not found.
     * @input Valid body, but ID not in DB
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'KT999' }, body: { LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue(null);

      await deductionController.updateDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 400 when LoaiKT is duplicate (different record).
     * @input Valid ID, but new LoaiKT belongs to a different record
     * @output Status 400
     */
    test('returns 400 when LoaiKT exists in another record', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'KT001', MaKT: undefined }, body: { LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue({ MaKT: 'KT001', update: updateFn });
      khauTruMock.findOne.mockResolvedValue({ MaKT: 'KT002' }); // Different record has same type

      await deductionController.updateDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when deduction is updated successfully.
     * @input Valid ID and payload, no type conflict
     * @output Status 200
     */
    test('returns 200 when updated successfully', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'KT001', MaKT: 'KT001' }, body: { LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue({ MaKT: 'KT001', update: updateFn });
      khauTruMock.findOne.mockResolvedValue(null); // No conflict

      await deductionController.updateDeduction(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'KT001' }, body: { LoaiKT: 'BHXH', PhanTram: 8 } });
      const res = mockResponse();
      khauTruMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await deductionController.updateDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deleteDeduction
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deleteDeduction
   */
  describe('deleteDeduction', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await deductionController.deleteDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when deduction is not found.
     * @input req.params.ID = 'KT999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'KT999' } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue(null);

      await deductionController.deleteDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when deduction is deleted successfully.
     * @input Valid ID
     * @output Status 200
     */
    test('returns 200 when deleted successfully', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'KT001' } });
      const res = mockResponse();
      khauTruMock.findByPk.mockResolvedValue({ MaKT: 'KT001', destroy: mockDestroy });

      await deductionController.deleteDeduction(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'KT001' } });
      const res = mockResponse();
      khauTruMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await deductionController.deleteDeduction(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
