const { dateTime2Date, getWeekNumber, generateMissingWeeks, date2DateTime } = require("@/helpers/date");
const scheduleService = require("@services/schedule.service.js");
const teacherService = require("../services/teacher.service");
const prisma = require("@/helpers/prisma.client");

class ScheduleController {
  async create(req, res, next) {
    try {
      console.log(req.body)
      const startDate = new Date(req.body.startDate)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(req.body.endDate)
      endDate.setHours(23, 59, 59, 999)
      const data = {
        ...req.body,
        startDate: startDate,
        endDate: endDate,
      }
      const schedule = await scheduleService.create(data);
      res.ok(schedule);
    } catch (error) {
      next(error);
    }
  }

  async createBulk(req, res, next) {
    try {
      const { classId, startDate, endDate } = req.body[0]
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      await scheduleService.delVersion(classId, startDate, endDate);

      await scheduleService.createBulk(
        req.body.map(s => ({
          ...s,
          startDate: start,
          endDate: end
        }))
      );

      const schedules = await scheduleService.version(classId, startDate, endDate);
      res.ok(schedules);
    } catch (error) {
      next(error);
    }
  }


  async merge(req, res, next) {
    try {
      const { classId, startDate, endDate } = req.body
      await scheduleService.delVersion(classId, startDate, endDate);
      res.ok([]);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { classId, startDate, endDate } = req.useQuery;
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      const schedules = await scheduleService.all(
        1,
        63,
        {
          classId: classId,
          startDate: {
            gte: start,
            lte: end
          }
        });
      res.ok(
        startDate && endDate ? schedules.data : [],
        schedules.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { classId } = req.useQuery;
      const schedules = await scheduleService.history(classId);
      const base = schedules.map(e => ({
        s: e.startDate,
        e: e.endDate,
      }));
      const rs = [...base, ...generateMissingWeeks(base)].sort((a, b) => a.s - b.s).map(i => ({
        startDate: dateTime2Date(i.s),
        endDate: dateTime2Date(i.e),
        week: {
          weekStart: getWeekNumber(i.s),
          weekEnd: getWeekNumber(i.e)
        }
      }));
      res.ok(rs)
    } catch (err) {
      next(err);
    }
  }

  async teachers(req, res, next) {
    try {
      const {
        subjectId,
        startDate,
        endDate,
        teacherId,
        dayOfWeek,
        period,
      } = req.useQuery
      const teachers = await prisma.teacher.findMany({
        where: {
          subjects: {
            some: { id: subjectId },
          },
          timetableEntries: {
            none: {
              dayOfWeek: dayOfWeek,
              period: period,
              AND: [
                { startDate: { lte: new Date(endDate) } },
                { endDate: { gte: new Date(startDate) } },
              ],
              NOT: {teacherId}
            },
            
          },
        },
        include: { subjects: true }
      })

      res.ok(teachers)
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.useParams;
      const schedule = await scheduleService.update(id, req.body);
      res.ok(schedule);
    } catch (error) {
      next(error);
    }
  }
  async modify(req, res, next) {
    console.log("\n================= MODIFY TIMETABLE =================");

    try {
      // 1️⃣ Log request đầu vào
      const { id } = req.useParams;

      console.log("📥 REQUEST");
      console.log({
        id,
        body: req.body,
      });

      // 2️⃣ Check conflict
      console.log("\n🔍 STEP 1: CHECK SWAP");
      const conflict = await scheduleService.checkSwap(id, req.body);

      if (conflict) {
        console.warn("⚠️ CONFLICT DETECTED");
        console.table({
          currentId: id,
          conflictId: conflict.id,
          classId: conflict.classId,
          dayOfWeek: conflict.dayOfWeek,
          period: conflict.period,
          startDate: conflict.startDate,
          endDate: conflict.endDate,
        });

        // 3️⃣ Swap
        console.log("\n🔁 STEP 2: SWAP SCHEDULE");
        const result = await scheduleService.swap(id, conflict.id);

        console.log("✅ SWAP SUCCESS");
        console.table(result);

        console.log("====================================================\n");
        return res.ok(result);
      }

      // 4️⃣ Update bình thường
      console.log("\n✏️ STEP 2: UPDATE SCHEDULE");
      const updated = await scheduleService.update(id, req.body);

      console.log("✅ UPDATE SUCCESS");
      console.table(updated);

      console.log("====================================================\n");
      return res.ok(updated);

    } catch (err) {
      console.error("❌ MODIFY ERROR");
      console.error(err);

      console.log("====================================================\n");
      next(err);
    }
  }



  async delete(req, res, next) {
    try {
      const { id } = req.useParams;
      await scheduleService.delete(id);
      res.ok(null, `Student ${id} deleted successfully`);
    } catch (error) {
      next(error);
    }
  }
  async comparison(req, res, next) {
    try {
      const { classId, aStartDate, aEndDate, bStartDate, bEndDate } = req.useQuery;
      const aSchedules = await scheduleService.version(classId, aStartDate, aEndDate);
      const bSchedules = await scheduleService.version(classId, bStartDate, bEndDate);
      res.ok({ a: aSchedules, b: bSchedules },
        {
          a: {
            start: getWeekNumber(new Date(aStartDate)),
            end: getWeekNumber(new Date(aEndDate))
          },
          b: {
            start: getWeekNumber(new Date(bStartDate)),
            end: getWeekNumber(new Date(bEndDate))
          }
        });
    } catch (error) {
      next(error);
    }
  }
  async dateOfClass(req, res, next) {
    try {
      const { classId, date } = req.useQuery;
      const schedule = await scheduleService.classOfDate(classId, new Date(date));
      res.ok(schedule);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScheduleController();