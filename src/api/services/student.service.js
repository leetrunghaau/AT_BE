const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query")
const createError = require('http-errors');

class StudentService {
  async getMeta() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const total = await prisma.student.count();
    const stats = await prisma.studentAttendant.groupBy({
      by: ['status'],
      _min: {
        status: true,
      },
      _count: {
        status: true
      },
      where: {
        timeTemp: { gte: start, lte: end }
      },

    })
    const result = { present: 0, absent: 0, late: 0 };
    stats.forEach(s => {
      result[s.status] = s._count.status;
    });

    return { total, ...result };
  }

  async create(data) {
    return await prisma.student.create({ data });
  }

  async createBulk(data) {
    return await prisma.student.createMany({ data: data });
  }

  async getAll(page = 1, limit = 10, filters = {}) {
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);
    return prisma.student.findMany({
      skip,
      take,
      where,
      include: {
        schoolClass: true
      },
    })
  }

  async logs(page = 1, limit = 10, now = new Date(), classId = null, s = null) {
    const { skip, take } = buildPagination(page, limit);
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);
    const where = {};
    if (s) where.name = { contains: s }
    if (classId) where.classId = classId
    return await prisma.student.findMany({
      skip,
      take,
      where,
      include: {
        studentLogs: {
          where: {
            logTime: {
              gte: startOfDate,
              lte: endOfDate,
            },
          },
          orderBy: { logTime: "asc" } // (tuỳ chọn)
        },
        studentAttendants: {
          where: {
            timeTemp: {
              gte: startOfDate,
              lte: endOfDate,
            },
          },
        },
        schoolClass: {
          include: {
            timetableEntries: {
              where: {
                dayOfWeek: now.getDay() || 7,
                startDate: { lte: now },
                endDate: { gte: now }
              },
              include: {
                subject: true,
                teacher: true
              }

            }
          }
        }
      },
    });
  }
  // async gets(page = 1, limit = 10, filters = {}) {
  //   const { skip, take } = buildPagination(page, limit);
  //   const where = buildWhere(filters);
  //   return prisma.student.findMany({
  //     skip,
  //     take,
  //     where,
  //     include: {
  //       schoolClass: true
  //     },
  //   })
  // }

  async getById(id) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        schoolClass: true,
      }
    });
    if (!student) throw createError.NotFound('Student not found');
    return student;
  }

  async att(classId, now) {
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);

    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);

    return await prisma.student.findMany({
      where: { classId },
      include: {
        studentLogs: {
          where: {
            logTime: {
              gte: startOfDate,
              lte: endOfDate,
            },
          },
          orderBy: { logTime: "asc" } // (tuỳ chọn)
        },
        studentAttendants: {
          where: {
            timeTemp: {
              gte: startOfDate,
              lte: endOfDate,
            },
          },
        },
      },
    });
  }


  async update(id, data) {
    return await prisma.student.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.student.delete({ where: { id } });
  }
}

module.exports = new StudentService();
