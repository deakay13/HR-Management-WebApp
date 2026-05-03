import { jest } from '@jest/globals';
import { Pagination } from '../../src/utils/paginations.js';

describe('Pagination', () => {
  test('trả về mặc định page=1, size=10 khi không có query', () => {
    const result = Pagination({});
    expect(result.page).toBe(1);
    expect(result.finalSize).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.limit).toBe(10);
  });

  test('trả về page=2, size=20 khi query hợp lệ', () => {
    const result = Pagination({ page: '2', size: '20' });
    expect(result.page).toBe(2);
    expect(result.finalSize).toBe(20);
    expect(result.offset).toBe(20);
    expect(result.limit).toBe(20);
  });

  test('size=0 trả hết bản ghi (limit=2000)', () => {
    const result = Pagination({ page: '1', size: '0' });
    expect(result.limit).toBe(2000);
    expect(result.finalSize).toBe(10);
    expect(result.offset).toBe(0);
  });

  test('size không hợp lệ thì về mặc định 10', () => {
    const result = Pagination({ page: '1', size: '15' });
    expect(result.finalSize).toBe(10);
  });

  test('page=3, size=30 tính offset đúng', () => {
    const result = Pagination({ page: '3', size: '30' });
    // size=30 nằm trong allowedSizes, finalSize=30, offset=(3-1)*30=60
    expect(result.offset).toBe(60);
    expect(result.limit).toBe(30);
    expect(result.finalSize).toBe(30);
  });

  test('page không hợp lệ thì về 1', () => {
    const result = Pagination({ page: 'abc', size: '10' });
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });

  test.each([10, 20, 30, 40, 50])('chấp nhận size=%i', (size) => {
    const result = Pagination({ size: String(size) });
    expect(result.finalSize).toBe(size);
  });
});
