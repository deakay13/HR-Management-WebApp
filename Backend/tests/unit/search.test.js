import { jest } from '@jest/globals';
import { buildWhereClause } from '../../src/utils/search.js';

// Mock Op từ sequelize 
const Op = await import('sequelize').then(m => m.Op);

describe('buildWhereClause', () => {
  test('trả về object rỗng khi không có query/config', () => {
    const where = buildWhereClause({}, {});
    expect(where).toEqual({});
  });

  test('keyword search tạo Op.or trên nhiều field', () => {
    const where = buildWhereClause(
      { keyword: 'Nguyễn' },
      { searchFields: ['TenNV', 'Email'] }
    );
    expect(where[Op.or]).toBeDefined();
    expect(where[Op.or]).toHaveLength(2);
    expect(where[Op.or][0]).toEqual({
      TenNV: { [Op.like]: '%Nguyễn%' },
    });
  });

  test('exactFields filter chính xác', () => {
    const where = buildWhereClause(
      { MaPB: 'PB001' },
      { exactFields: ['MaPB'] }
    );
    expect(where.MaPB).toBe('PB001');
  });

  test('exactFields bỏ qua khi không có giá trị', () => {
    const where = buildWhereClause(
      {},
      { exactFields: ['MaPB'] }
    );
    expect(where.MaPB).toBeUndefined();
  });

  test('likeFields tạo Op.like', () => {
    const where = buildWhereClause(
      { Thang: '03' },
      { likeFields: ['Thang'] }
    );
    expect(where.Thang[Op.like]).toBe('%03%');
  });

  test('rangeFields tạo Op.gte/Op.lte', () => {
    const where = buildWhereClause(
      { minLuong: '5000000', maxLuong: '10000000' },
      { rangeFields: ['Luong'] }
    );
    expect(where.Luong[Op.gte]).toBe(5000000);
    expect(where.Luong[Op.lte]).toBe(10000000);
  });

  test('rangeFields chỉ có min', () => {
    const where = buildWhereClause(
      { minLuong: '5000000' },
      { rangeFields: ['Luong'] }
    );
    expect(where.Luong[Op.gte]).toBe(5000000);
    expect(where.Luong[Op.lte]).toBeUndefined();
  });

  test('kết hợp keyword + exactFields + rangeFields', () => {
    const where = buildWhereClause(
      { keyword: 'test', MaPB: 'PB001', minLuong: '1000' },
      {
        searchFields: ['TenNV'],
        exactFields: ['MaPB'],
        rangeFields: ['Luong'],
      }
    );
    expect(where[Op.or]).toBeDefined();
    expect(where.MaPB).toBe('PB001');
    expect(where.Luong[Op.gte]).toBe(1000);
  });
});
