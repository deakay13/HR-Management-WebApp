
export function Pagination(query) {
    const page = parseInt(query.page) || 1;
    const size = parseInt(query.size);

    // Nếu size = 0 thì lấy hết
    if (size === 0) {
        return { offset: 0, limit: null, page, finalSize: 0 };
    }

    const allowedSizes = [10, 20, 30, 40, 50];
    const finalSize = allowedSizes.includes(size) ? size : 10;

    const offset = (page - 1) * finalSize;
    const limit = finalSize;

    return { offset, limit, page, finalSize };
}
