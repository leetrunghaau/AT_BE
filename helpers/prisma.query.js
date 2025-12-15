function buildWhere(filters = {}) {
    const where = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (Array.isArray(value)) {
            where[key] = { in: value };
        }
        else if (typeof value === 'string') {
            where[key] = { contains: value };
        }
            else {
            where[key] = value;
        }
    });

    return where;
}

function buildPagination(p = 1, limit = 10) {
    const skip = (p - 1) * limit;
    return { skip, take: limit, page: p, limit };
}

module.exports = {
  buildWhere,
  buildPagination
};
