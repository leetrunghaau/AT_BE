const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query")
const createError = require('http-errors');

class TeacherLogService {
  async getMeta() {
    const total = await prisma.teacherLog.count();
    return { total }
  }

  async create(data) {
    return await prisma.teacherLog.create({ data });
  }
  

  async createBulk(data) {
    return await prisma.teacherLog.createMany({ data: data });
  }

  async logsOfDate(teacherId, now) {
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);

    return await prisma.teacherLog.findMany({
      where: {
        teacherId,
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
      prisma.teacherLog.findMany({
        skip,
        take,
        where,
        include: {
          schoolClass: true
        },
      }),
      prisma.teacherLog.count({ where }),
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
      prisma.teacherLog.findMany({
        skip,
        take,
        where,
        include: {
          schoolClass: true
        },
      }),
      prisma.teacherLog.count({ where }),
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
    const log = await prisma.teacherLog.findUnique({
      where: { id },
      include: {
        schoolClass: true,
      }
    });
    if (!log) throw createError.NotFound('teacher log not found');
    return log;
  }

  async update(id, data) {
    const log = await prisma.teacherLog.update({ where: { id }, data, include: { schoolClass: true } });
    const pagination = await this.getMeta()
    return {
      data: log,
      pagination
    }
  }

  async delete(id) {
    const log = await prisma.teacherLog.delete({ where: { id } });
    const pagination = await this.getMeta()
    return {
      data: log,
      pagination
    }
  }
}

module.exports = new TeacherLogService();
