import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Account (TaiKhoan) Controllers.
 * Covers all CRUD operations with validation, duplicate checks, session-based
 * online/offline status, Excel export, 400/404/500 error handling.
 */
describe('Account Controllers', () => {
  let accountControllers;
  let taiKhoanMock;
  let nhanVienMock;
  let vaiTroMock;
  let sessionMock;
  let bcryptMock;
  let paginationMock;
  let exceljsMock;

  beforeEach(async () => {
    jest.resetModules();

    taiKhoanMock = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    nhanVienMock = {
      findByPk: jest.fn(),
    };

    vaiTroMock = {
      findByPk: jest.fn(),
    };

    sessionMock = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    bcryptMock = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
    };

    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    exceljsMock = {
      Workbook: jest.fn().mockImplementation(() => ({
        addWorksheet: jest.fn().mockReturnValue({
          mergeCells: jest.fn(),
          getRow: jest.fn().mockReturnValue({
            getCell: jest.fn().mockReturnValue({}),
            eachCell: jest.fn().mockImplementation((cb) => cb({})),
            values: [],
          }),
          columns: [],
          addRow: jest.fn().mockReturnValue({
            eachCell: jest.fn().mockImplementation((cb) => cb({})),
          }),
        }),
        xlsx: { write: jest.fn().mockResolvedValue() },
      })),
    };

    jest.unstable_mockModule('../../../src/models/auth/TaiKhoan.js', () => ({ default: taiKhoanMock }));
    jest.unstable_mockModule('../../../src/models/information/NhanVien.js', () => ({ default: nhanVienMock }));
    jest.unstable_mockModule('../../../src/models/auth/VaiTro.js', () => ({ default: vaiTroMock }));
    jest.unstable_mockModule('../../../src/models/auth/Session.js', () => ({ default: sessionMock }));
    jest.unstable_mockModule('bcrypt', () => ({ default: bcryptMock }));
    jest.unstable_mockModule('exceljs', () => ({ default: exceljsMock }));
    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({ Pagination: paginationMock }));
    jest.unstable_mockModule('../../../src/utils/dateFormat.js', () => ({
      formatVNDateTime: jest.fn().mockReturnValue('2026-01-01'),
    }));
    // Mock sequelize Op
    jest.unstable_mockModule('sequelize', () => ({
      Op: { or: Symbol('or'), like: Symbol('like') },
    }));

    const mod = await import('../../../src/controllers/users/accountControllers.js');
    accountControllers = mod;
  });

  // ─────────────────────────────────────────────
  // readAllAccount
  // ─────────────────────────────────────────────

  /**
   * @description Tests for readAllAccount (paginated list with online status)
   */
  describe('readAllAccount', () => {
    /**
     * @description Should return 200 with paginated account list.
     * @input req.query = {}
     * @output Status 200, { data: [...] }
     */
    test('returns 200 with paginated account list', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      taiKhoanMock.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [{ MaTK: 'TK01', NhanVien: { HoVaTen: 'Nguyen Van A' }, VaiTro: { TenVaiTro: 'Admin' }, createdAt: new Date(), updatedAt: new Date() }],
      });
      sessionMock.findAll.mockResolvedValue([{ MaTK: 'TK01' }]);

      await accountControllers.readAllAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should include search filter when 'search' query is present.
     * @input req.query = { search: 'admin' }
     * @output Status 200
     */
    test('returns 200 with search filter applied', async () => {
      const req = mockRequest({ query: { search: 'admin' } });
      const res = mockResponse();
      taiKhoanMock.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await accountControllers.readAllAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      taiKhoanMock.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await accountControllers.readAllAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // readAccountById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for readAccountById
   */
  describe('readAccountById', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await accountControllers.readAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 200 when account is found.
     * @input req.params.ID = 'TK01'
     * @output Status 200
     */
    test('returns 200 when account found', async () => {
      const req = mockRequest({ params: { ID: 'TK01' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01' });

      await accountControllers.readAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 404 when account is not found.
     * @input req.params.ID = 'TK_INVALID'
     * @output Status 404
     */
    test('returns 404 when account not found', async () => {
      const req = mockRequest({ params: { ID: 'TK_INVALID' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null);

      await accountControllers.readAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws error
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'TK01' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await accountControllers.readAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // createAccount
  // ─────────────────────────────────────────────

  /**
   * @description Tests for createAccount
   */
  describe('createAccount', () => {
    /**
     * @description Should return 400 when required fields are missing after validation passes.
     * @input Missing MaTK/MaNV/MaVT
     * @output Status 400
     */
    test('returns 400 when required fields are missing', async () => {
      const req = mockRequest({ body: { TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } }); // Missing MaTK, MaNV, MaVT
      const res = mockResponse();

      await accountControllers.createAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when account code (MaTK) already exists.
     * @input Valid full body, but MaTK already in DB
     * @output Status 400
     */
    test('returns 400 when MaTK already exists', async () => {
      const req = mockRequest({ body: { MaTK: 'TK01', MaNV: 'NV01', MaVT: 'VT01', TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01' }); // Exists

      await accountControllers.createAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when employee (MaNV) does not exist.
     * @input Valid body, but MaNV not found in DB
     * @output Status 400
     */
    test('returns 400 when MaNV does not exist', async () => {
      const req = mockRequest({ body: { MaTK: 'TK01', MaNV: 'NV_INVALID', MaVT: 'VT01', TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null); // MaTK not found
      nhanVienMock.findByPk.mockResolvedValue(null); // NV not found

      await accountControllers.createAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 400 when employee already has an account.
     * @input Valid body, but MaNV already linked to another account
     * @output Status 400
     */
    test('returns 400 when employee already has account', async () => {
      const req = mockRequest({ body: { MaTK: 'TK01', MaNV: 'NV01', MaVT: 'VT01', TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null); // MaTK not found (OK)
      nhanVienMock.findByPk.mockResolvedValue({ MaNV: 'NV01' }); // NV exists
      taiKhoanMock.findOne.mockResolvedValue({ MaNV: 'NV01' }); // Existing account for NV

      await accountControllers.createAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when role (MaVT) does not exist.
     * @input Valid body, but MaVT not found
     * @output Status 404
     */
    test('returns 404 when MaVT does not exist', async () => {
      const req = mockRequest({ body: { MaTK: 'TK01', MaNV: 'NV01', MaVT: 'VT_INVALID', TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null);
      nhanVienMock.findByPk.mockResolvedValue({ MaNV: 'NV01' });
      taiKhoanMock.findOne.mockResolvedValue(null); // No existing account
      vaiTroMock.findByPk.mockResolvedValue(null); // Role not found

      await accountControllers.createAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 201 when account is created successfully.
     * @note bcrypt.hash is mocked via jest.unstable_mockModule('bcrypt').
     * @input All valid and unique data, bcrypt mock returns 'hashed-password'
     * @output Status 201
     */
    test('returns 201 when created successfully', async () => {
      const req = mockRequest({ body: { MaTK: 'TK01', MaNV: 'NV01', MaVT: 'VT01', TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null);
      nhanVienMock.findByPk.mockResolvedValue({ MaNV: 'NV01' });
      taiKhoanMock.findOne.mockResolvedValue(null);
      vaiTroMock.findByPk.mockResolvedValue({ MaVT: 'VT01' });
      taiKhoanMock.create.mockResolvedValue({ MaTK: 'TK01' });

      await accountControllers.createAccount(req, res);
      expect(bcryptMock.hash).toHaveBeenCalled();
      expect(taiKhoanMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return 500 on unexpected database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on unexpected error', async () => {
      const req = mockRequest({ body: { MaTK: 'TK01', MaNV: 'NV01', MaVT: 'VT01', TenTaiKhoan: 'user123', MatKhau: 'Pass@1234' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockRejectedValue(new Error('System error'));

      await accountControllers.createAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // updateAccountById
  // ─────────────────────────────────────────────

  /**
   * @description Tests for updateAccountById
   */
  describe('updateAccountById', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {}, body: {} });
      const res = mockResponse();

      await accountControllers.updateAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when account not found.
     * @input Invalid ID
     * @output Status 404
     */
    test('returns 404 when account not found', async () => {
      const req = mockRequest({ params: { ID: 'TK_INVALID' }, body: {} });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null);

      await accountControllers.updateAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 400 when password validation fails.
     * @input Invalid password format
     * @output Status 400
     */
    test('returns 400 when password fails validation', async () => {
      const req = mockRequest({ params: { ID: 'TK01' }, body: { MatKhau: 'weak' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01', MatKhau: 'old-hash', update: jest.fn() });

      await accountControllers.updateAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when provided MaVT does not exist.
     * @input Valid ID, existing account, but role not found
     * @output Status 404
     */
    test('returns 404 when MaVT not found', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'TK01' }, body: { MaVT: 'VT_INVALID' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01', MatKhau: 'old-hash', update: updateFn });
      vaiTroMock.findByPk.mockResolvedValue(null);

      await accountControllers.updateAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when account is updated without password change.
     * @input Valid ID, no MatKhau in body
     * @output Status 200
     */
    test('returns 200 when updated without password change', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'TK01' }, body: { TenTaiKhoan: 'newuser' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01', MatKhau: 'old-hash', update: updateFn });

      await accountControllers.updateAccountById(req, res);
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 200 when account is updated with new hashed password.
     * @note bcrypt.hash is mocked via jest.unstable_mockModule('bcrypt') returning 'hashed-password'.
     * @input Valid ID, valid MatKhau in body
     * @output Status 200, bcrypt.hash called
     */
    test('returns 200 when updated with password hash', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 'TK01' }, body: { MatKhau: 'NewPass@1' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01', MatKhau: 'old-hash', update: updateFn });

      await accountControllers.updateAccountById(req, res);
      expect(bcryptMock.hash).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'TK01' }, body: {} });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await accountControllers.updateAccountById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // deleteAccount
  // ─────────────────────────────────────────────

  /**
   * @description Tests for deleteAccount
   */
  describe('deleteAccount', () => {
    /**
     * @description Should return 400 when ID is missing.
     * @input req.params = {}
     * @output Status 400
     */
    test('returns 400 when ID is missing', async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await accountControllers.deleteAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return 404 when account not found.
     * @input Invalid ID
     * @output Status 404
     */
    test('returns 404 when account not found', async () => {
      const req = mockRequest({ params: { ID: 'TK_INVALID' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue(null);

      await accountControllers.deleteAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return 200 when account is deleted successfully.
     * @input Valid ID
     * @output Status 200
     */
    test('returns 200 when deleted successfully', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 'TK01' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockResolvedValue({ MaTK: 'TK01', destroy: mockDestroy });

      await accountControllers.deleteAccount(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return 500 on database error.
     * @input DB throws during findByPk
     * @output Status 500
     */
    test('returns 500 on database error', async () => {
      const req = mockRequest({ params: { ID: 'TK01' } });
      const res = mockResponse();
      taiKhoanMock.findByPk.mockRejectedValue(new Error('DB Error'));

      await accountControllers.deleteAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ─────────────────────────────────────────────
  // exportAccountToExcel
  // ─────────────────────────────────────────────

  /**
   * @description Tests for exportAccountToExcel
   */
  describe('exportAccountToExcel', () => {
    /**
     * @description Should return Excel file with appropriate headers.
     * @input Mock accounts with and without associated NhanVien/VaiTro
     * @output setHeader called and res.end called
     */
    test('returns Excel file with correct headers', async () => {
      const req = mockRequest();
      const res = mockResponse();
      taiKhoanMock.findAll.mockResolvedValue([
        { MaTK: 'TK01', NhanVien: { HoVaTen: 'A' }, VaiTro: { TenVaiTro: 'Admin' }, createdAt: new Date(), updatedAt: new Date() },
        { MaTK: 'TK02', NhanVien: null, VaiTro: null, createdAt: new Date(), updatedAt: new Date() }, // Missing associations
      ]);

      await accountControllers.exportAccountToExcel(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', expect.any(String));
      expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', expect.any(String));
      expect(res.end).toHaveBeenCalled();
    });

    /**
     * @description Should return 500 on export error.
     * @input DB throws during findAll
     * @output Status 500
     */
    test('returns 500 on export error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      taiKhoanMock.findAll.mockRejectedValue(new Error('Export Error'));

      await accountControllers.exportAccountToExcel(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
