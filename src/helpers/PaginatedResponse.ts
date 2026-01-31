export const paginatedResponse = <T>(results: T[], total: number, limit: number, pageNumber: number) => ({
    items: results,
    count: parseInt(String(total)),
    hasMore: total > limit * pageNumber,
    meta: {
        porPage: limit,
        totalPage: Math.ceil(total / limit),
        pageNumber,
        count: parseInt(String(total)),
    },
});
