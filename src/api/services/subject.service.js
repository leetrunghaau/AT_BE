const prisma = require("@/helpers/prisma.client");
const { buildPagination, buildWhere } = require("@/helpers/prisma.query.js");
const createError = require('http-errors');

class SubjectService {


  async getAll(page = 1, limit = 10, filters = {}) {
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);
    
    const [data, total] = await prisma.$transaction([
      prisma.subject.findMany({
        skip,
        take,
        where,
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id, data) {
    return await prisma.subject.update({ where: { id }, data });
  }


}

module.exports = new SubjectService();