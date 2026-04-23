import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for Department Controllers
 */
describe('Department Controllers', () => {
  let departmentsControllers;
  let departmentMock;

  beforeEach(async () => {
    jest.resetModules();

    departmentMock = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findAndCountAll: jest.fn()
    };

    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      PhongBan: departmentMock
    }));

    const mod = await import('../../../src/controllers/information/departmentsControllers.js');
    departmentsControllers = mod;
  });

  /**
   * @description Test suite for retrieving all departments
   * @function getAllDepartments
   */
  describe('getAllDepartments', () => {
    /**
     * @description Should return status 200 and a list of departments.
     * @input Mock request
     * @output Status 200 and departments array.
     */
    test('trả về danh sách phòng ban 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      departmentMock.findAll.mockResolvedValue([
        { MaPB: 'PB01' }
      ]);

      await departmentsControllers.getAllDepartments(req, res);
      
      expect(departmentMock.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    /**
     * @description Should return status 500 if database error occurs.
     * @input DB error thrown by findAll
     * @output Status 500
     */
    test('lỗi 500 nếu database error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      departmentMock.findAll.mockRejectedValue(new Error('DB Error'));

      await departmentsControllers.getAllDepartments(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for retrieving a department by ID
   * @function getDepartmentById
   */
  describe('getDepartmentById', () => {
    /**
     * @description Should return status 200 and department data if found.
     * @input Valid department ID
     * @output Status 200 and department object.
     */
    test('trả về 200 nếu tìm thấy phòng ban', async () => {
      const req = mockRequest({ params: { id: 'PB01' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue({ MaPB: 'PB01' });

      await departmentsControllers.getDepartmentById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ MaPB: 'PB01' });
    });

    /**
     * @description Should return status 404 if department is not found.
     * @input Invalid department ID
     * @output Status 404
     */
    test('trả về 404 nếu không tìm thấy phòng ban', async () => {
      const req = mockRequest({ params: { id: 'INVALID' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue(null);

      await departmentsControllers.getDepartmentById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 500 if database error occurs.
     * @input DB error
     * @output Status 500
     */
    test('trả về 500 nếu có lỗi DB', async () => {
      const req = mockRequest({ params: { id: 'PB01' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockRejectedValue(new Error('DB error'));

      await departmentsControllers.getDepartmentById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for creating a department
   * @function createDepartment
   */
  describe('createDepartment', () => {
    /**
     * @description Should return status 201 when department is successfully created.
     * @input Department creation data
     * @output Status 201 and created object
     */
    test('tạo phòng ban thành công trả về 201', async () => {
      const req = mockRequest({ body: { MaPB: 'PB01', TenPB: 'IT' } });
      const res = mockResponse();
      
      departmentMock.create.mockResolvedValue({ MaPB: 'PB01', TenPB: 'IT' });

      await departmentsControllers.createDepartment(req, res);
      
      expect(departmentMock.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return status 400 if validation or DB error occurs on create.
     * @input Error thrown
     * @output Status 400
     */
    test('lỗi 400 nếu tạo thất bại', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      
      departmentMock.create.mockRejectedValue(new Error('Create error'));

      await departmentsControllers.createDepartment(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  /**
   * @description Test suite for updating a department
   * @function updateDepartment
   */
  describe('updateDepartment', () => {
    /**
     * @description Should return status 404 if the department does not exist.
     * @input Invalid ID
     * @output Status 404
     */
    test('trả về 404 nếu không tìm thấy phòng ban', async () => {
      const req = mockRequest({ params: { id: 'INVALID' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue(null);

      await departmentsControllers.updateDepartment(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 200 upon successful update.
     * @input Valid ID and update payload
     * @output Status 200
     */
    test('cập nhật thành công trả về 200', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { id: 'PB01' }, body: { TenPB: 'HR' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue({ MaPB: 'PB01', update: updateFn });

      await departmentsControllers.updateDepartment(req, res);
      
      expect(updateFn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 400 if an error occurs during update.
     * @input DB error
     * @output Status 400
     */
    test('lỗi 400 nếu cập nhật thất bại', async () => {
      const req = mockRequest({ params: { id: 'PB01' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockRejectedValue(new Error('Update error'));

      await departmentsControllers.updateDepartment(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  /**
   * @description Test suite for deleting a department
   * @function deleteDepartment
   */
  describe('deleteDepartment', () => {
    /**
     * @description Should return status 404 if the department does not exist.
     * @input Invalid ID
     * @output Status 404
     */
    test('lỗi 404 nếu không tìm thấy phòng ban', async () => {
      const req = mockRequest({ params: { id: 'PB_INVALID' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue(null);

      await departmentsControllers.deleteDepartment(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 200 upon successful deletion.
     * @input Valid ID
     * @output Status 200
     */
    test('trả về 200 nếu xóa thành công', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { id: 'PB01' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockResolvedValue({ MaPB: 'PB01', destroy: mockDestroy });

      await departmentsControllers.deleteDepartment(req, res);
      
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 500 if an error occurs during deletion.
     * @input DB error
     * @output Status 500
     */
    test('lỗi 500 nếu xóa thất bại', async () => {
      const req = mockRequest({ params: { id: 'PB01' } });
      const res = mockResponse();
      
      departmentMock.findByPk.mockRejectedValue(new Error('Delete error'));

      await departmentsControllers.deleteDepartment(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
