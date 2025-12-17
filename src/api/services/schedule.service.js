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
    console.log("\n================= CHECK SWAP =================");

    // 1️⃣ Lấy item hiện tại
    const currentItem = await prisma.timetableEntry.findUnique({
      where: { id },
    });

    if (!currentItem) {
      console.error("❌ Item not found:", id);
      throw new Error("Item not found");
    }

    // 2️⃣ Chuẩn hóa thời gian (RẤT QUAN TRỌNG)
    const start = new Date(currentItem.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(currentItem.endDate);
    end.setHours(23, 59, 59, 999);

    // 3️⃣ Log dữ liệu đầu vào
    console.log("📌 CURRENT ITEM");
    console.table({
      id: currentItem.id,
      classId: currentItem.classId,
      dayOfWeek: currentItem.dayOfWeek,
      period: currentItem.period,
      startDate: currentItem.startDate,
      endDate: currentItem.endDate,
    });

    console.log("📌 NORMALIZED RANGE");
    console.log({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    console.log("📌 TARGET SLOT");
    console.log({
      dayOfWeek: data.dayOfWeek,
      period: data.period,
    });

    // 4️⃣ Query tìm slot trùng
    const conflict = await prisma.timetableEntry.findFirst({
      where: {
        classId: currentItem.classId,
        dayOfWeek: data.dayOfWeek,
        period: data.period,
        NOT: { id },
        AND: [
          { startDate: { lte: end } },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: start } },
            ],
          },
        ],
      },
    });

    // 5️⃣ Log kết quả
    if (conflict) {
      console.warn("⚠️ CONFLICT FOUND");
      console.table({
        id: conflict.id,
        classId: conflict.classId,
        dayOfWeek: conflict.dayOfWeek,
        period: conflict.period,
        startDate: conflict.startDate,
        endDate: conflict.endDate,
      });

      console.log("📌 OVERLAP CHECK");
      console.log({
        "conflict.start <= current.end": conflict.startDate <= end,
        "conflict.end >= current.start":
          conflict.endDate ? conflict.endDate >= start : "endDate is NULL",
      });
    } else {
      console.log("✅ NO CONFLICT FOUND");
    }

    console.log("================================================\n");

    return conflict || null;
  }
  async swap(id1, id2) {
    console.log("\n================= SWAP TIMETABLE =================");
    console.log("🔁 SWAP REQUEST", { id1, id2 });

    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Lấy 2 item
      console.log("\n📥 STEP 1: FETCH ITEMS");
      const items = await tx.timetableEntry.findMany({
        where: { id: { in: [id1, id2] } },
      });

      console.log("📌 FETCH RESULT COUNT:", items.length);
      console.table(
        items.map(i => ({
          id: i.id,
          classId: i.classId,
          dayOfWeek: i.dayOfWeek,
          period: i.period,
          startDate: i.startDate,
          endDate: i.endDate,
        }))
      );

      if (items.length !== 2) {
        console.error("❌ Item not found for swap");
        throw new Error("Item not found for swap");
      }

      const [item1, item2] = items;

      // 2️⃣ Giải phóng slot item1 (tránh unique/overlap)
      console.log("\n🧹 STEP 2: TEMP CLEAR ITEM 1");
      console.log({
        id: item1.id,
        from: { dayOfWeek: item1.dayOfWeek, period: item1.period },
        to: { dayOfWeek: -1, period: -1 },
      });

      await tx.timetableEntry.update({
        where: { id: item1.id },
        data: { dayOfWeek: -1, period: -1 },
      });

      // 3️⃣ Gán slot item1 cho item2
      console.log("\n🔄 STEP 3: MOVE ITEM 2");
      console.log({
        id: item2.id,
        from: { dayOfWeek: item2.dayOfWeek, period: item2.period },
        to: { dayOfWeek: item1.dayOfWeek, period: item1.period },
      });

      await tx.timetableEntry.update({
        where: { id: item2.id },
        data: { dayOfWeek: item1.dayOfWeek, period: item1.period },
      });

      // 4️⃣ Gán slot item2 cho item1
      console.log("\n🔄 STEP 4: MOVE ITEM 1");
      console.log({
        id: item1.id,
        to: { dayOfWeek: item2.dayOfWeek, period: item2.period },
      });

      const swappedItem1 = await tx.timetableEntry.update({
        where: { id: item1.id },
        data: { dayOfWeek: item2.dayOfWeek, period: item2.period },
        include: {
          subject: true,
          teacher: true,
        },
      });

      // 5️⃣ Lấy item2 sau swap
      console.log("\n📤 STEP 5: FETCH ITEM 2 AFTER SWAP");

      const swappedItem2 = await tx.timetableEntry.findUnique({
        where: { id: item2.id },
        include: {
          subject: true,
          teacher: true,
        },
      });

      console.log("\n✅ SWAP SUCCESS");
      console.table([
        {
          id: swappedItem1.id,
          dayOfWeek: swappedItem1.dayOfWeek,
          period: swappedItem1.period,
        },
        {
          id: swappedItem2.id,
          dayOfWeek: swappedItem2.dayOfWeek,
          period: swappedItem2.period,
        },
      ]);

      console.log("=================================================\n");

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