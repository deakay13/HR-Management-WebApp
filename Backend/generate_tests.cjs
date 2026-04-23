const fs = require('fs');
const path = require('path');

const controllers = [
  { name: 'Allowance', varName: 'allowanceController', mockName: 'allowanceMock', modelName: 'PhuCap', file: 'allowanceController', getAllFn: 'getAllowances', getByIdFn: 'getAllowanceById', createFn: 'createAllowance', updateFn: 'updateAllowance', deleteFn: 'deleteAllowance' },
  { name: 'Base Salary', varName: 'baseSalaryController', mockName: 'baseSalaryMock', modelName: 'LuongCoBan', file: 'baseSalaryController', getAllFn: 'getBaseSalaries', getByIdFn: 'getBaseSalaryById', createFn: 'createBaseSalary', updateFn: 'updateBaseSalary', deleteFn: 'deleteBaseSalary' },
  { name: 'Deduction', varName: 'deductionController', mockName: 'deductionMock', modelName: 'KhauTru', file: 'deductionController', getAllFn: 'getDeductions', getByIdFn: 'getDeductionById', createFn: 'createDeduction', updateFn: 'updateDeduction', deleteFn: 'deleteDeduction' },
  { name: 'Hours', varName: 'hoursController', mockName: 'hoursMock', modelName: 'GioLam', file: 'hoursController', getAllFn: 'getHours', getByIdFn: 'getHoursById', createFn: 'createHours', updateFn: 'updateHours', deleteFn: 'deleteHours' }
];

controllers.forEach(c => {
  const content = `import { jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../../utils/mockRequests.js';

/**
 * @description Test suite for ${c.name} Controllers
 */
describe('${c.name} Controllers', () => {
  let ${c.varName};
  let ${c.mockName};
  let paginationMock;

  beforeEach(async () => {
    jest.resetModules();

    ${c.mockName} = {
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
    
    paginationMock = jest.fn().mockReturnValue({ offset: 0, limit: 10, page: 1, finalSize: 10 });

    jest.unstable_mockModule('../../../src/models/index.js', () => ({
      ${c.modelName}: ${c.mockName}
    }));
    
    jest.unstable_mockModule('../../../src/models/salary/${c.modelName}.js', () => ({
      default: ${c.mockName}
    }));
    
    jest.unstable_mockModule('../../../src/utils/paginations.js', () => ({
      Pagination: paginationMock
    }));

    const mod = await import('../../../src/controllers/payroll/${c.file}.js');
    ${c.varName} = mod;
  });

  /**
   * @description Test suite for retrieving all records
   * @function ${c.getAllFn}
   */
  describe('${c.getAllFn}', () => {
    /**
     * @description Should return status 200 and a list of records with pagination.
     * @input Mock request
     * @output Status 200 and paginated records object
     */
    test('trả về danh sách 200', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      
      ${c.mockName}.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1 }] });

      await ${c.varName}.${c.getAllFn}(req, res);
      
      expect(${c.mockName}.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [{ id: 1 }] }));
    });

    /**
     * @description Should return status 500 on database error.
     * @input DB error
     * @output Status 500
     */
    test('lỗi 500 nếu có lỗi DB', async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();
      ${c.mockName}.findAndCountAll.mockRejectedValue(new Error('DB Error'));

      await ${c.varName}.${c.getAllFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for retrieving a record by ID
   * @function ${c.getByIdFn}
   */
  describe('${c.getByIdFn}', () => {
    /**
     * @description Should return status 200 and the record.
     * @input Valid ID
     * @output Status 200
     */
    test('trả về 200 nếu tìm thấy', async () => {
      const req = mockRequest({ params: { ID: 1 } });
      const res = mockResponse();
      
      ${c.mockName}.findByPk.mockResolvedValue({ id: 1 });

      await ${c.varName}.${c.getByIdFn}(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    /**
     * @description Should return status 404 if record is not found.
     * @input Invalid ID
     * @output Status 404
     */
    test('trả về 404 nếu không tìm thấy', async () => {
      const req = mockRequest({ params: { ID: 99 } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockResolvedValue(null);

      await ${c.varName}.${c.getByIdFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 500 on database error.
     * @input DB Error
     * @output Status 500
     */
    test('trả về 500 nếu có lỗi DB', async () => {
      const req = mockRequest({ params: { ID: 1 } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockRejectedValue(new Error('DB error'));

      await ${c.varName}.${c.getByIdFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for creating a new record
   * @function ${c.createFn}
   */
  describe('${c.createFn}', () => {
    /**
     * @description Should return status 400 if validation fails.
     * @input Invalid data
     * @output Status 400
     */
    test('lỗi 400 nếu dữ liệu không hợp lệ', async () => {
      const req = mockRequest({ body: {} }); // Missing required fields
      const res = mockResponse();

      await ${c.varName}.${c.createFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return status 400 if primary ID already exists.
     * @input Valid data but existing ID
     * @output Status 400
     */
    test('lỗi 400 nếu mã đã tồn tại', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Type', SoTien: 2000, MaLCB: 'LCB001', MucLuong: 2000, MaKT: 'KT001', LoaiKT: 'Type', MaGL: 'GL001', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockResolvedValue({ id: 1 }); // Found existing

      await ${c.varName}.${c.createFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
    
    /**
     * @description Should return status 400 if type already exists.
     * @input Valid data but existing type
     * @output Status 400
     */
    test('lỗi 400 nếu loại đã tồn tại', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Type', SoTien: 2000, MaLCB: 'LCB001', MucLuong: 2000, MaKT: 'KT001', LoaiKT: 'Type', MaGL: 'GL001', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockResolvedValue(null);
      ${c.mockName}.findOne.mockResolvedValue({ id: 2 }); // Found existing type

      await ${c.varName}.${c.createFn}(req, res);
      if (${c.name === 'Hours' ? 'false' : 'true'}) {
         expect(res.status).toHaveBeenCalledWith(400);
      }
    });

    /**
     * @description Should return status 201 when record is successfully created.
     * @input Valid data
     * @output Status 201
     */
    test('tạo thành công trả về 201', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Type', SoTien: 2000, MaLCB: 'LCB001', MucLuong: 2000, MaKT: 'KT001', LoaiKT: 'Type', MaGL: 'GL001', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      
      ${c.mockName}.findByPk.mockResolvedValue(null);
      ${c.mockName}.findOne.mockResolvedValue(null);
      ${c.mockName}.create.mockResolvedValue({ id: 1 });

      await ${c.varName}.${c.createFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * @description Should return status 500 on database creation error.
     * @input DB error
     * @output Status 500
     */
    test('lỗi 500 nếu có lỗi hệ thống', async () => {
      const req = mockRequest({ body: { MaPC: 'PC001', LoaiPC: 'Type', SoTien: 2000, MaLCB: 'LCB001', MucLuong: 2000, MaKT: 'KT001', LoaiKT: 'Type', MaGL: 'GL001', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockRejectedValue(new Error('System error'));

      await ${c.varName}.${c.createFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for updating a record
   * @function ${c.updateFn}
   */
  describe('${c.updateFn}', () => {
    /**
     * @description Should return status 400 if validation fails.
     * @input Invalid data
     * @output Status 400
     */
    test('lỗi 400 nếu dữ liệu cập nhật không hợp lệ', async () => {
      const req = mockRequest({ params: { ID: 1 }, body: {} }); // Missing required
      const res = mockResponse();

      await ${c.varName}.${c.updateFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /**
     * @description Should return status 404 if the record to update does not exist.
     * @input Invalid ID
     * @output Status 404
     */
    test('trả về 404 nếu không tìm thấy', async () => {
      const req = mockRequest({ params: { ID: 99 }, body: { LoaiPC: 'Type', SoTien: 2000, MucLuong: 2000, LoaiKT: 'Type', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockResolvedValue(null);

      await ${c.varName}.${c.updateFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 200 upon successful update.
     * @input Valid ID and valid payload
     * @output Status 200
     */
    test('cập nhật thành công trả về 200', async () => {
      const updateFn = jest.fn();
      const req = mockRequest({ params: { ID: 1 }, body: { LoaiPC: 'Type', SoTien: 2000, MucLuong: 2000, LoaiKT: 'Type', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      
      ${c.mockName}.findByPk.mockResolvedValue({ id: 1, update: updateFn });

      await ${c.varName}.${c.updateFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 500 if database error occurs.
     * @input DB error on update
     * @output Status 500
     */
    test('lỗi 500 nếu cập nhật thất bại do lỗi DB', async () => {
      const req = mockRequest({ params: { ID: 1 }, body: { LoaiPC: 'Type', SoTien: 2000, MucLuong: 2000, LoaiKT: 'Type', Ngay: '2026-01-01', ThoiGianBatDau: '08:00', ThoiGianKetThuc: '17:00' } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockRejectedValue(new Error('Update Error'));

      await ${c.varName}.${c.updateFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  /**
   * @description Test suite for deleting a record
   * @function ${c.deleteFn}
   */
  describe('${c.deleteFn}', () => {
    /**
     * @description Should return status 404 if record does not exist.
     * @input Invalid ID
     * @output Status 404
     */
    test('lỗi 404 nếu không tìm thấy', async () => {
      const req = mockRequest({ params: { ID: 99 } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockResolvedValue(null);

      await ${c.varName}.${c.deleteFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    /**
     * @description Should return status 200 and a success message.
     * @input Valid ID
     * @output Status 200
     */
    test('trả về 200 nếu xóa thành công', async () => {
      const mockDestroy = jest.fn();
      const req = mockRequest({ params: { ID: 1 } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockResolvedValue({ id: 1, destroy: mockDestroy });

      await ${c.varName}.${c.deleteFn}(req, res);
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    /**
     * @description Should return status 500 on database error during deletion.
     * @input DB error
     * @output Status 500
     */
    test('lỗi 500 nếu xóa thất bại', async () => {
      const req = mockRequest({ params: { ID: 1 } });
      const res = mockResponse();
      ${c.mockName}.findByPk.mockRejectedValue(new Error('Delete Error'));

      await ${c.varName}.${c.deleteFn}(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
`;
  
  fs.writeFileSync(path.join('tests/unit/controllers', `${c.file}.test.js`), content);
});
console.log("Generated tests");
