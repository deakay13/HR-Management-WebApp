import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Employee Controllers
 */
describe('Employee Controllers', () => {
  let employeeControllers;
  let employeeMock;
  let departmentMock;
  let searchServiceMock;
  let paginationMock;
  let exceljsMock;

  beforeEach(async () => {
    jest.resetModules();

    employeeMock = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
    
    departmentMock = {
      findByPk: jest.fn()
    };

    searchServiceMock = jest.fn();
    paginationMock = jest.fn().mockReturnValue({ limit: 10, offset: 0 });
    
    exceljsMock = {
      Workbook: jest.fn().mockImplementation(() => {
        return {
          addWorksheet: jest.fn().mockReturnValue({
            mergeCells: jest.fn(),
            getRow: jest.fn().mockReturnValue({
              getCell: jest.fn().mockReturnValue({}),
              eachCell: jest.fn().mockImplementation((cb) => cb({})),
              values: []
            }),
            columns: [],
            addRow: jest.fn().mockReturnValue({
              eachCell: jest.fn().mockImplementation((cb) => cb({}))
            })
          }),
          xlsx: {
            write: jest.fn().mockResolvedValue()
          }
        };
      })
    };

    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      NhanVien: employeeMock,
      PhongBan: departmentMock
    }));

    jest.unstable_mockModule('../../../src/utils/search.js', () => ({
      searchService: searchServiceMock
    }));

    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({
      Pagination: paginationMock
    }));

    jest.unstable_mockModule('exceljs', () => ({
      default: exceljsMock
    }));

    const mod = await import('../../../src/controllers/information/employeeControllers.js');
    employeeControllers = mod;
  });

  /**
   * @description Test suite for retrieving all employees
   * @function getAllEmployees
   */
  describe('getAllEmployees', () => {
    /**
     * @description Should return status 200 and a list of employees.
     * @input Mock request
     * @output Status 200 and array of employees
     */
    test('trả về danh sách nhân viên 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      employeeMock.findAll.mockResolvedValue([{ MaNV: 'NV01' }]);

      await employeeControllers.getAllEmployees(req, res);
      
      expect(employeeMock.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ MaNV: 'NV01' }]);
    });

    /**
     * @description Should return status 500 on database error.
     * @input DB error
     * @output Status 500
     */
    test('lỗi 500 nếu có lỗi DB', async () => {
      const req = mockRequest();
      const res = mockResponse();
      employeeMock.findAll.mockRejectedValue(new Error('DB Error'));

      await employeeControllers.getAllEmployees(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for searching employees
   * @function searchEmployees
   */
  describe('searchEmployees', () => {
    /**
     * @description Should return status 200 and search results.
     * @input Search query with keyword
     * @output Status 200 and search result object
     */
    test('trả về 200 và kết quả tìm kiếm', async () => {
      const req = mockRequest({ query: { keyword: 'Hieu' } });
      const res = mockResponse();
      
      searchServiceMock.mockResolvedValue({ totalItems: 1, data: [{ MaNV: 'NV01' }] });

      await employeeControllers.searchEmployees(req, res);
      
      expect(paginationMock).toHaveBeenCalled();
      expect(searchServiceMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ totalItems: 1, data: [{ MaNV: 'NV01' }] });
    });

    /**
     * @description Should set query.size = 0 if no keyword is provided.
     * @input Search query without keyword
     * @output Status 200
     */
    test('set size = 0 nếu không có keyword', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      searchServiceMock.mockResolvedValue({ totalItems: 0, data: [] });

      await employeeControllers.searchEmployees(req, res);
      expect(paginationMock).toHaveBeenCalledWith(expect.objectContaining({ size: 0 }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 500 on search error.
     * @input Search error
     * @output Status 500
     */
    test('lỗi 500 nếu search thất bại', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      searchServiceMock.mockRejectedValue(new Error('Search Error'));

      await employeeControllers.searchEmployees(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for exporting employees to Excel
   * @function exportEmployeesToExcel
   */
  describe('exportEmployeesToExcel', () => {
    /**
     * @description Should return an excel file and set appropriate headers.
     * @input Mock request
     * @output Headers set for excel, and res.end called
     */
    test('xuất file excel thành công', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      employeeMock.findAll.mockResolvedValue([
        { MaNV: 'NV01', PhongBan: { MaPB: 'PB01', TenPB: 'IT' } },
        { MaNV: 'NV02' } // missing PhongBan
      ]);

      await employeeControllers.exportEmployeesToExcel(req, res);
      
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', expect.any(String));
      expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', expect.any(String));
      expect(res.end).toHaveBeenCalled();
    });

    /**
     * @description Should return status 500 on excel export error.
     * @input Export error
     * @output Status 500
     */
    test('lỗi 500 nếu xuất thất bại', async () => {
      const req = mockRequest();
      const res = mockResponse();
      employeeMock.findAll.mockRejectedValue(new Error('Excel Error'));

      await employeeControllers.exportEmployeesToExcel(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for retrieving a single employee by ID
   * @function getEmployeeById
   */
  describe('getEmployeeById', () => {
    /**
     * @description Should return status 200 and the employee.
     * @input Valid employee ID
     * @output Status 200
     */
    test('trả về 200 nếu tìm thấy nhân viên', async () => {
      const req = mockRequest({ params: { id: 'NV01' } });
      const res = mockResponse();
      
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01' });

      await employeeControllers.getEmployeeById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ MaNV: 'NV01' });
    });

    /**
     * @description Should return status 404 if employee is not found.
     * @input Invalid ID
     * @output Status 404
     */
    test('trả về 404 nếu không tìm thấy nhân viên', async () => {
      const req = mockRequest({ params: { id: 'INVALID' } });
      const res = mockResponse();
      employeeMock.findByPk.mockResolvedValue(null);

      await employeeControllers.getEmployeeById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 500 on database error.
     * @input DB Error
     * @output Status 500
     */
    test('trả về 500 nếu có lỗi', async () => {
      const req = mockRequest({ params: { id: 'NV01' } });
      const res = mockResponse();
      employeeMock.findByPk.mockRejectedValue(new Error('DB error'));

      await employeeControllers.getEmployeeById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for creating a new employee
   * @function createEmployee
   */
  describe('createEmployee', () => {
    /**
     * @description Should return status 400 if the assigned department does not exist.
     * @input Invalid Department ID
     * @output Status 400
     */
    test('trả về 400 nếu thiếu mã phòng ban', async () => {
      const req = mockRequest({ body: { MaPB: 'PB_INVALID' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue(null);

      await employeeControllers.createEmployee(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return status 201 when an employee is successfully created (without file).
     * @input Valid employee data
     * @output Status 201
     */
    test('tạo nhân viên thành công trả về 201 (không có file ảnh)', async () => {
      const req = mockRequest({ body: { MaNV: 'NV01', MaPB: 'PB01', HoVaTen: 'Nguyen Van A', GioiTinh: 'Nam', NgaySinh: '1990-01-01', SDT: '0123456789', NgayVaoLam: '2020-01-01', DiaChi: 'Hanoi' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue({ MaPB: 'PB01' });
      employeeMock.create.mockResolvedValue({ MaNV: 'NV01' });

      await employeeControllers.createEmployee(req, res);
      
      expect(employeeMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return status 201 when an employee is successfully created (with file).
     * @input Valid employee data and mock file
     * @output Status 201
     */
    test('tạo nhân viên thành công trả về 201 (có file ảnh)', async () => {
      const req = mockRequest({ 
        body: { MaNV: 'NV01', MaPB: 'PB01', HoVaTen: 'Nguyen Van A', GioiTinh: 'Nam', NgaySinh: '1990-01-01', SDT: '0123456789', NgayVaoLam: '2020-01-01', DiaChi: 'Hanoi' },
        file: { mimetype: 'image/png', buffer: Buffer.from('mock-image') }
      });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue({ MaPB: 'PB01' });
      employeeMock.create.mockResolvedValue({ MaNV: 'NV01' });

      await employeeControllers.createEmployee(req, res);
      
      expect(employeeMock.create).toHaveBeenCalledWith(expect.objectContaining({
        HinhAnh: expect.stringContaining('data:image/png;base64,')
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return status 400 on creation error.
     * @input Validation error
     * @output Status 400
     */
    test('lỗi 400 nếu có lỗi khi tạo', async () => {
      const req = mockRequest({ body: { MaPB: 'PB01' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue({ MaPB: 'PB01' });
      employeeMock.create.mockRejectedValue(new Error('Validation Error'));

      await employeeControllers.createEmployee(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  /**
   * @description Test suite for updating an employee
   * @function updateEmployee
   */
  describe('updateEmployee', () => {
    /**
     * @description Should return status 404 if the employee to update does not exist.
     * @input Invalid employee ID
     * @output Status 404
     */
    test('trả về 404 nếu không tìm thấy nhân viên', async () => {
      const req = mockRequest({ params: { id: 'INVALID' } });
      const res = mockResponse();
      employeeMock.findByPk.mockResolvedValue(null);

      await employeeControllers.updateEmployee(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 200 upon successful update without an image file.
     * @input Valid employee ID
     * @output Status 200
     */
    test('cập nhật thành công trả về 200 (không có file)', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { id: 'NV01' }, body: { MaPB: 'PB01', HoVaTen: 'New Name', GioiTinh: 'Nam', NgaySinh: '1990-01-01', SDT: '0123456789', NgayVaoLam: '2020-01-01', DiaChi: 'Hanoi' } });
      const res = mockResponse();
      
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01', update: updateFn });

      await employeeControllers.updateEmployee(req, res);
      expect(updateFn).toHaveBeenCalledWith({ MaPB: 'PB01', HoVaTen: 'New Name', GioiTinh: 'Nam', NgaySinh: '1990-01-01', SDT: '0123456789', NgayVaoLam: '2020-01-01', DiaChi: 'Hanoi' });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 200 upon successful update with an image file.
     * @input Valid employee ID and image file
     * @output Status 200
     */
    test('cập nhật thành công trả về 200 (có file)', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ 
        params: { id: 'NV01' }, 
        body: { MaPB: 'PB01', HoVaTen: 'New Name', GioiTinh: 'Nam', NgaySinh: '1990-01-01', SDT: '0123456789', NgayVaoLam: '2020-01-01', DiaChi: 'Hanoi' },
        file: { mimetype: 'image/jpeg', buffer: Buffer.from('new-image') }
      });
      const res = mockResponse();
      
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01', update: updateFn });

      await employeeControllers.updateEmployee(req, res);
      expect(updateFn).toHaveBeenCalledWith(expect.objectContaining({
        HinhAnh: expect.stringContaining('data:image/jpeg;base64,')
      }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 400 if database error occurs.
     * @input DB error on update
     * @output Status 400
     */
    test('lỗi 400 nếu cập nhật thất bại', async () => {
      const req = mockRequest({ params: { id: 'NV01' } });
      const res = mockResponse();
      employeeMock.findByPk.mockRejectedValue(new Error('Update Error'));

      await employeeControllers.updateEmployee(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  /**
   * @description Test suite for deleting an employee
   * @function deleteEmployee
   */
  describe('deleteEmployee', () => {
    /**
     * @description Should return status 404 if employee does not exist.
     * @input Invalid employee ID
     * @output Status 404
     */
    test('lỗi 404 nếu không tìm thấy nhân viên', async () => {
      const req = mockRequest({ params: { id: 'INVALID' } });
      const res = mockResponse();
      employeeMock.findByPk.mockResolvedValue(null);

      await employeeControllers.deleteEmployee(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 200 and a success message.
     * @input Valid employee ID
     * @output Status 200
     */
    test('trả về 200 nếu xóa thành công', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { id: 'NV01' } });
      const res = mockResponse();
      employeeMock.findByPk.mockResolvedValue({ MaNV: 'NV01', destroy: mockDestroy });

      await employeeControllers.deleteEmployee(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 500 on database error during deletion.
     * @input DB error
     * @output Status 500
     */
    test('lỗi 500 nếu xóa thất bại', async () => {
      const req = mockRequest({ params: { id: 'NV01' } });
      const res = mockResponse();
      employeeMock.findByPk.mockRejectedValue(new Error('Delete Error'));

      await employeeControllers.deleteEmployee(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
