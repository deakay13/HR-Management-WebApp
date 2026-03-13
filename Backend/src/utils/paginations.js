
export function Pagination(query) {
    const page = parseInt(query.page) || 1;
    const size = parseInt(query.size) || 10;

    const allowedSizes = [10, 20, 30, 40, 50];
    const finalSize = allowedSizes.includes(size) ? size : 10;

    const offset = (page - 1) * finalSize;
    const limit = finalSize;

    return { offset, limit, page, finalSize };
}