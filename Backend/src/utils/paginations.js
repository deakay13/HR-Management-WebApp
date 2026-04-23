export function Pagination(query) {
  const page = parseInt(query.page) || 1;
  const size = parseInt(query.size);

  // Nếu size = 0 thì lấy tối đa 500 bản ghi để hỗ trợ UI phân trang client-side mà không làm sập server
  if (size === 0) {
    return { offset: 0, limit: 2000, page, finalSize: 10 };
  }

  const allowedSizes = [10, 20, 30, 40, 50];
  const finalSize = allowedSizes.includes(size) ? size : 10;

  const offset = (page - 1) * finalSize;
  const limit = finalSize;

  return { offset, limit, page, finalSize };
}
