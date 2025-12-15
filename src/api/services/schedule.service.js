const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query.js");
const { forSession } = require("@/helpers/slot");
const { LESSON_PERIODS } = require("@/src/config/constants");
const createError = require('http-errors');

class ScheduleService {

  async create(scheduleData) {
    return await prisma.timetableEntry.create({
      data: scheduleData,
      include: {
        subject: true,
        teacher: true
      },
    })
  }
  async createBulk(classData) {
    return await prisma.timetableEntry.createMany({ data: classData })
  }

  async all(page = 1, limit = 10, filters = {}) {
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);

    const data = await prisma.timetableEntry.findMany({
      skip,
      take,
      where,
      include: {
        subject: true,
        teacher: true
      },
    });
    const total = await prisma.timetableEntry.count({ where });
    return {
      data: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async version(classId, start, end) {
    const startDate = new Date(start)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(end)
    endDate.setHours(23, 59, 59, 999)
    return await prisma.timetableEntry.findMany({
      take: 7 * LESSON_PERIODS.length,
      where: {
        classId: classId,
        startDate: { gte: startDate, lte: endDate },
      },
      include: {
        subject: true,
        teacher: true
      },
    });
  }

  async history(classId) {
    const entries = await prisma.timetableEntry.findMany({
      where: { classId },
      select: { startDate: true, endDate: true },
      distinct: ['startDate', 'endDate'],
      orderBy: { startDate: 'asc' }
    });
    return entries;
  }
  async classOfDate(classId, now) {

    return await prisma.timetableEntry.findMany({
      where: {
        classId: classId,
        dayOfWeek: now.getDay() || 7,
        startDate: { lte: now },
        endDate: { gte: now }
      }, orderBy: {
        period: "asc"
      }
    })
  }
  async classOfSession(classId, now) {
    const session = forSession(now)
    return await prisma.timetableEntry.findMany({
      where: {
        classId: classId,
        period: { in: session.map(s => s.period) },
        dayOfWeek: now.getDay() || 7,
        startDate: { lte: now },
        endDate: { gte: now }
      }, orderBy: {
        period: "asc"
      }
    })
  }


  async checkSwap(id, data) {
    const currentItem = await prisma.timetableEntry.findUnique({ where: { id } });
    if (!currentItem) throw new Error("Item not found");

    return await prisma.timetableEntry.findFirst({
      where: {
        classId: currentItem.classId,
        dayOfWeek: data.dayOfWeek,
        period: data.period,
        NOT: { id },
      },
    }) || null;
  }
  async swap(id1, id2) {
    return await prisma.$transaction(async (tx) => {
      const items = await tx.timetableEntry.findMany({
        where: { id: { in: [id1, id2] } }
      });

      if (items.length !== 2) throw new Error("Item not found for swap");

      const [item1, item2] = items;

      await tx.timetableEntry.update({
        where: { id: item1.id },
        data: { dayOfWeek: -1, period: -1 }
      });

      await tx.timetableEntry.update({
        where: { id: item2.id },
        data: { dayOfWeek: item1.dayOfWeek, period: item1.period }
      });

      const swappedItem1 = await tx.timetableEntry.update({
        where: { id: item1.id },
        data: { dayOfWeek: item2.dayOfWeek, period: item2.period },
        include: {
          subject: true,
          teacher: true
        }
      });

      const swappedItem2 = await tx.timetableEntry.findUnique({
        where: { id: item2.id },
        include: {
          subject: true,
          teacher: true
        }
      });

      return [swappedItem1, swappedItem2];
    });
  }


  async id(id) {
    const rs = await prisma.timetableEntry.findUnique({ where: { id } });
    if (!rs) throw createError.NotFound('Class not found');
    return rs
  }

  async update(id, data) {
    return await prisma.timetableEntry.update({
      where: { id: id },
      data: data,
      include: {
        teacher: true,
        subject: true
      }
    })
  }
  async delete(id) {
    await prisma.timetableEntry.delete({ where: { id } });
  }
  async delVersion(classId, start, end) {
    const startDate = new Date(start)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(end)
    endDate.setHours(23, 59, 59, 999)
    await prisma.timetableEntry.deleteMany({
      where: {
        classId: classId,
        startDate: { gte: startDate, lte: endDate },
      }
    });
  }
  async merge(classId, startDate, endDate) {
    // await prisma.timetableEntry.deleteMany({ where: { classId: classId, startDate: { gte: startDate }, endDate: { lte: endDate } } });
  }
}

module.exports = new ScheduleService();