import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Hours (GioLam) Controllers.
 * Note: Exported function names are createHour/getHours/getHourById/updateHour/deleteHour (singular).
 * Covers all CRUD operations with validation, 404, and 500 error handling.
 */
describe('Hours Controllers', () => {
  let hoursController;
  let gioLamMock;
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    gioLamMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/salary/GioLam.js', () => ({
      default: gioLamMock,
    }));

    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({
      Pagination: paginationMock,
    }));

    const mod = await import('../../../src/controllers/payroll/hoursController.js');
    hoursController = mod;
  });

  // ─────────────────────────────────────────────
  // getHours (list)
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getHours (paginated list)
   */
  describe('getHours', () => {
    /**
     * @description Should return 200 with paginated hours data.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      gioLamMock.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ MaGL: 'GL001' }] });

      await hoursController.getHours(req, res);

      expect(gioLamMock.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [{ MaGL: 'GL001' }] }));
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
      gioLamMock.findAndCountAll.mockResolvedValue({ count: 2, rows: [] });

      await hoursController.getHours(req, res);
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
      gioLamMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await hoursController.getHours(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // getHourById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for getHourById
   */
  describe('getHourById', () => {
    /**
     * @description Should return 200 when hour record is found.
     * @input req.params.ID = 'GL001'
     * @output Status 200
     */
    test('returns 200 when record found', async () => {
      const req = mockRequest({ params: { ID: 'GL001' } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue({ MaGL: 'GL001', SoGioLam: 8 });

      await hoursController.getHourById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ MaGL: 'GL001', SoGioLam: 8 });
    });

    /**
     * @description Should return 404 when hour record is not found.
     * @input req.params.ID = 'GL999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'GL999' } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue(null);

      await hoursController.getHourById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'GL001' } });
      const res = mockResponse();
      gioLamMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await hoursController.getHourById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createHour
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createHour
   */
  describe('createHour', () => {
    /**
     * @description Should return 400 when validation fails (empty body).
     * @input req.body = {}
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await hoursController.createHour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when MaGL already exists.
     * @input Valid body but MaGL already in DB
     * @output Status 400
     */
    test('returns 400 when MaGL already exists', async () => {
      const req = mockRequest({ body: { MaGL: 'GL001', SoGioLam: 8 } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue({ MaGL: 'GL001' }); // Exists

      await hoursController.createHour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 201 when hour record is created successfully.
     * @input Valid body with unique MaGL
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaGL: 'GL001', SoGioLam: 8 } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue(null);
      gioLamMock.create.mockResolvedValue({ MaGL: 'GL001', SoGioLam: 8 });

      await hoursController.createHour(req, res);
      expect(gioLamMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected error', async () => {
      const req = mockRequest({ body: { MaGL: 'GL001', SoGioLam: 8 } });
      const res = mockResponse();
      gioLamMock.findByPk.mockRejectedValue(new Error('System error'));

      await hoursController.createHour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updateHour
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updateHour
   */
  describe('updateHour', () => {
    /**
     * @description Should return 400 when validation fails (invalid SoGioLam).
     * @input req.body = {} (missing SoGioLam)
     * @output Status 400
     */
    test('returns 400 when validation fails', async () => {
      const req = mockRequest({ params: { ID: 'GL001' }, body: {} });
      const res = mockResponse();

      await hoursController.updateHour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when hour record to update is not found.
     * @input Valid body, but ID not in DB
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'GL999' }, body: { SoGioLam: 8 } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue(null);

      await hoursController.updateHour(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when hour record is updated successfully.
     * @input Valid ID and payload
     * @output Status 200
     */
    test('returns 200 when updated successfully', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'GL001' }, body: { SoGioLam: 8 } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue({ MaGL: 'GL001', update: updateFn });

      await hoursController.updateHour(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'GL001' }, body: { SoGioLam: 8 } });
      const res = mockResponse();
      gioLamMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await hoursController.updateHour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deleteHour
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deleteHour
   */
  describe('deleteHour', () => {
    /**
     * @description Should return 404 when hour record is not found.
     * @input req.params.ID = 'GL999'
     * @output Status 404
     */
    test('returns 404 when record not found', async () => {
      const req = mockRequest({ params: { ID: 'GL999' } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue(null);

      await hoursController.deleteHour(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when hour record is deleted successfully.
     * @input Valid ID
     * @output Status 200
     */
    test('returns 200 when deleted successfully', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'GL001' } });
      const res = mockResponse();
      gioLamMock.findByPk.mockResolvedValue({ MaGL: 'GL001', destroy: mockDestroy });

      await hoursController.deleteHour(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'GL001' } });
      const res = mockResponse();
      gioLamMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await hoursController.deleteHour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
