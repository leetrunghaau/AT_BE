const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query")
const createError = require('http-errors');

class StudentLogService {
  async getMeta() {
    const total = await prisma.studentLog.count();
    return { total }
  }

  async create(data) {
    return await prisma.studentLog.create({ data });
  }
  

  async createBulk(data) {
    return await prisma.studentLog.createMany({ data: data });
  }

  async logsOfDate(studentId, now) {
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);

    return await prisma.studentLog.findMany({
      where: {
        studentId,
        logTime: { gte: startOfDate, lte: endOfDate },
      },
      orderBy: { logTime: "desc" },
    });
  }

  async getAll(page = 1, limit = 10, filters = {}) {
    console.log(filters)
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);
    console.log(where)

    const [data, total] = await prisma.$transaction([
      prisma.studentLog.findMany({
        skip,
        take,
        where,
        include: {
          schoolClass: true
        },
      }),
      prisma.studentLog.count({ where }),
    ]);
    const meta = await this.getMeta()
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta
    };
  }
  async gets(page = 1, limit = 10, filters = {}) {
    console.log(filters)
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);
    console.log(where)

    const [data, total] = await prisma.$transaction([
      prisma.studentLog.findMany({
        skip,
        take,
        where,
        include: {
          schoolClass: true
        },
      }),
      prisma.studentLog.count({ where }),
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

  async getById(id) {
    const log = await prisma.studentLog.findUnique({
      where: { id },
      include: {
        schoolClass: true,
      }
    });
    if (!log) throw createError.NotFound('student log not found');
    return log;
  }

  async update(id, data) {
    const log = await prisma.studentLog.update({ where: { id }, data, include: { schoolClass: true } });
    const pagination = await this.getMeta()
    return {
      data: log,
      pagination
    }
  }

  async delete(id) {
    const log = await prisma.studentLog.delete({ where: { id } });
    const pagination = await this.getMeta()
    return {
      data: log,
      pagination
    }
  }
}

module.exports = new StudentLogService();
