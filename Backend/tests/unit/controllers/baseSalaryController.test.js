import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Base Salary (LuongCoBan) Controllers.
 * Covers all CRUD operations: list, get by ID, create (with validation & duplicates),
 * update (with validation, duplicate salary, 404), and delete (with 404/400).
 */
describe('Base Salary Controllers', () => {
  let baseSalaryController;
  let luongCoBanMock;
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    luongCoBanMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/salary/LuongCoBan.js', () => ({
      default: luongCoBanMock,
    }));

    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({
      Pagination: paginationMock,
    }));

    const mod = await import('../../../src/controllers/payroll/baseSalaryController.js');
    baseSalaryController = mod;
  });

  // ─────────────────────────────────────────────
  // getBaseSalaries
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getBaseSalaries (paginated list)
   */
  describe('getBaseSalaries', () => {
    /**
     * @description Should return 200 with paginated data.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      luongCoBanMock.findAndCountAll.mockResolvedValue({ count: 2, rows: [{ MaLCB: 'LCB001' }, { MaLCB: 'LCB002' }] });

      await baseSalaryController.getBaseSalaries(req, res);

      expect(luongCoBanMock.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
    });

    /**
     * @description Should return 200 with no limit when limit is null.
     * @input Pagination returns limit=null
     * @output Status 200, totalPages=1
     */
    test('returns 200 with totalPages=1 when limit is null', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      paginationMock.mockReturnValue({ offset: 0, limit: null, page: 1, finalSize: 10 });
      luongCoBanMock.findAndCountAll.mockResolvedValue({ count: 5, rows: [] });

      await baseSalaryController.getBaseSalaries(req, res);
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
      luongCoBanMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await baseSalaryController.getBaseSalaries(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // getBaseSalaryById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getBaseSalaryById
   */
  describe('getBaseSalaryById', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {} (no ID)
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await baseSalaryController.getBaseSalaryById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when base salary is found.
     * @input req.params.ID = 'LCB001'
     * @output Status 200
     */
    test('returns 200 when record found', async () => {
      const req = mockRequest({ params: { ID: 'LCB001' } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue({ MaLCB: 'LCB001', LuongCB: 5000000 });

      await baseSalaryController.getBaseSalaryById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 404 when base salary is not found.
     * @input req.params.ID = 'LCB999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'LCB999' } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue(null);

      await baseSalaryController.getBaseSalaryById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'LCB001' } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await baseSalaryController.getBaseSalaryById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createBaseSalary
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createBaseSalary
   */
  describe('createBaseSalary', () => {
    /**
     * @description Should return 400 when validation fails (invalid format / missing fields).
     * @input req.body = {}
     * @output Status 400 with errors
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await baseSalaryController.createBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when MaLCB already exists.
     * @input req.body with valid data, but MaLCB already in DB
     * @output Status 400
     */
    test('returns 400 when MaLCB already exists', async () => {
      const req = mockRequest({ body: { MaLCB: 'LCB001', LuongCB: 5000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue({ MaLCB: 'LCB001' }); // Exists

      await baseSalaryController.createBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when salary amount already exists.
     * @input req.body with valid data, but LuongCB already in DB
     * @output Status 400
     */
    test('returns 400 when LuongCB already exists', async () => {
      const req = mockRequest({ body: { MaLCB: 'LCB001', LuongCB: 5000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue(null);
      luongCoBanMock.findOne.mockResolvedValue({ LuongCB: 5000000 }); // Amount exists

      await baseSalaryController.createBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 201 when base salary is created successfully.
     * @input Valid body with unique MaLCB and LuongCB
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaLCB: 'LCB001', LuongCB: 5000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue(null);
      luongCoBanMock.findOne.mockResolvedValue(null);
      luongCoBanMock.create.mockResolvedValue({ MaLCB: 'LCB001', LuongCB: 5000000 });

      await baseSalaryController.createBaseSalary(req, res);
      expect(luongCoBanMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected system error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected error', async () => {
      const req = mockRequest({ body: { MaLCB: 'LCB001', LuongCB: 5000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockRejectedValue(new Error('System error'));

      await baseSalaryController.createBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updateBaseSalary
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updateBaseSalary
   */
  describe('updateBaseSalary', () => {
    /**
     * @description Should return 400 when validation fails (missing LuongCB).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ params: { ID: 'LCB001' }, body: {} });
      const res = mockResponse();

      await baseSalaryController.updateBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when base salary to update is not found.
     * @input Valid body, but ID not in DB
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'LCB999' }, body: { LuongCB: 6000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue(null);

      await baseSalaryController.updateBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 400 when LuongCB is duplicate (different record).
     * @input Valid ID found, but new LuongCB already used by another record
     * @output Status 400
     */
    test('returns 400 when LuongCB already exists in another record', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'LCB001', MaLCB: undefined }, body: { LuongCB: 6000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue({ MaLCB: 'LCB001', update: updateFn });
      luongCoBanMock.findOne.mockResolvedValue({ MaLCB: 'LCB002' }); // Different record has same salary

      await baseSalaryController.updateBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when base salary is updated successfully.
     * @input Valid ID and payload, no duplicate salary
     * @output Status 200
     */
    test('returns 200 when updated successfully', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'LCB001', MaLCB: 'LCB001' }, body: { LuongCB: 6000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue({ MaLCB: 'LCB001', update: updateFn });
      luongCoBanMock.findOne.mockResolvedValue(null); // No duplicate

      await baseSalaryController.updateBaseSalary(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 200 when updating the same record (same salary value allowed).
     * @input findOne returns same record (MaLCB matches params.MaLCB)
     * @output Status 200
     */
    test('returns 200 when salary matches same record (no conflict)', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'LCB001', MaLCB: 'LCB001' }, body: { LuongCB: 6000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue({ MaLCB: 'LCB001', update: updateFn });
      // existLuong.MaLCB === req.params.MaLCB -> no conflict
      luongCoBanMock.findOne.mockResolvedValue({ MaLCB: 'LCB001' });

      await baseSalaryController.updateBaseSalary(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'LCB001' }, body: { LuongCB: 6000000 } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await baseSalaryController.updateBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deleteBaseSalary
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deleteBaseSalary
   */
  describe('deleteBaseSalary', () => {
    /**
     * @description Should return 400 when ID is not provided.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await baseSalaryController.deleteBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when base salary not found.
     * @input req.params.ID = 'LCB999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'LCB999' } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue(null);

      await baseSalaryController.deleteBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when base salary is deleted successfully.
     * @input Valid ID
     * @output Status 200
     */
    test('returns 200 when deleted successfully', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'LCB001' } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockResolvedValue({ MaLCB: 'LCB001', destroy: mockDestroy });

      await baseSalaryController.deleteBaseSalary(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'LCB001' } });
      const res = mockResponse();
      luongCoBanMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await baseSalaryController.deleteBaseSalary(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
