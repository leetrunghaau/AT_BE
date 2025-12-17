const createError = require('http-errors');
const studentService = require('./student.service');
const scheduleService = require('./schedule.service');
const studentLogService = require('./student-log.service');
const teacherService = require('./teacher.service');
const { LESSON_PERIODS, TIME_RULE } = require('@/src/config/constants');
const { createUuidv7 } = require('@/helpers/uuid');
const { time2Minutes } = require('@/helpers/time');
const { checkDupLog } = require('@/helpers/log');
const studentAttendenceService = require('./student-attendence.service');
const teacherAttendenceService = require('./teacher-attendence.service');
const teacherLogService = require('./teacher-log.service');
const { forSession } = require('@/helpers/slot');

class AttendanceService {

  async student(id, classId, direction) {

    const student = await studentService.getById(id);
    const rs = { ...student, MHS: student.id, role: "student" };

    if (classId !== student.classId) return { ...rs, feedback: "Bạn đã đi nhầm lớp" };

    const now = new Date();

    const logsDate = await studentLogService.logsOfDate(id, now);
    if (checkDupLog(logsDate, now, direction)) {
      return { ...rs, timeTemp: logsDate[0].logTime, feedback: direction == "IN" ? "Bạn đã điểm danh" :"Bạn đã Check out" };
    }

    if (direction === "IN") {
      const result = await this.#checkInStudent(student, classId, now);
      return { ...rs, ...result };
    } else if (direction === "OUT") {
      const result = await this.#checkOutStudent(student, classId, now);
      return { ...rs, ...result };
    }

    return { ...rs, timeTemp: now, feedback: "Direction không hợp lệ" };
  }
  async teacher(id, classId, direction) {
    const teacher = await teacherService.getById(id);
    const rs = { ...teacher, role: "teacher" };

    const now = new Date();

    const logsDate = await teacherLogService.logsOfDate(id, now);
    if (checkDupLog(logsDate, now, direction)) {
      return { ...rs, timeTemp: logsDate[0].logTime, feedback: "Bạn đã điểm danh" };
    }

    if (direction === "IN") {
      const result = await this.#checkInTeacher(teacher, classId, now);
      return { ...rs, ...result };
    } else if (direction === "OUT") {
      const result = await this.#checkOutTeacher(teacher, classId, now);
      return { ...rs, ...result };
    }

    return { ...rs, timeTemp: now, feedback: "Direction không hợp lệ" };
  }


  async #checkInStudent(student, classId, now) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();


    const schedules = await scheduleService.classOfSession(classId, now);
    if (!schedules.length) return { feedback: "Không có thời khóa biểu" };

    const periodInfo = LESSON_PERIODS.find(s => s.period === schedules[0].period);
    if (!periodInfo) return { feedback: "Không xác định được tiết học" };

    const diffMinutes = nowMinutes - time2Minutes(periodInfo.start);
    if (diffMinutes < TIME_RULE.EARLY) return { feedback: "Vui lòng điểm danh lại khi tới giờ điểm danh" };

    const status = diffMinutes < TIME_RULE.LATE ? "present" : "late";

    const attendanced = await studentAttendenceService.attendenced(student.id, now)

    if (!attendanced) {
      await studentAttendenceService.create({ id: await createUuidv7(), studentId: student.id, status, timeTemp: now })
    } else {
      // const periodSet = new Set(forSession(now).map(s => s.period))
      // !schedules.some(s => periodSet.has(s.period))
      // if (status == "late" && attendanced.status == "present") {
      //   await studentAttendenceService.update(attendanced.id, { status: "late" })
      // }
    }

    await studentLogService.create({
      id: await createUuidv7(),
      studentId: student.id,
      classId,
      logTime: now,
      direction: "IN"
    });

    return { timeTemp: now, feedback: "Check in thành công" };
  }
  async #checkInTeacher(teacher, classId, now) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const schedules = await scheduleService.classOfDate(classId, now);
    if (!schedules.length) return { feedback: "Không có thời khóa biểu" };

    const periodInfo = LESSON_PERIODS.find(s => s.period === schedules[0].period);
    if (!periodInfo) return { feedback: "Không xác định được tiết học" };

    const diffMinutes = nowMinutes - time2Minutes(periodInfo.start);
    if (diffMinutes > TIME_RULE.EARLY) return { feedback: "Vui lòng điểm danh lại khi tới giờ điểm danh" };

    const status = diffMinutes < TIME_RULE.LATE ? "present" : "late";

    const attendanced = await teacherAttendenceService.attendenced(teacher.id, now)
    if (!attendanced)

    if (!attendanced) {
      await teacherAttendenceService.create({ id: await createUuidv7(), teacherId: teacher.id, status, timeTemp: now })
    } else {
      const periodSet = new Set(forSession(now).map(s => s.period))
      !schedules.some(s => periodSet.has(s.period))
      if (status == "late" && attendanced.status == "present") {
        await studentAttendenceService.update(attendanced.id, { status: "late" })
      }
    }

    await teacherLogService.create({
      id: await createUuidv7(),
      teacherId: teacher.id,
      classId,
      logTime: now,
      direction: "IN"
    });

    return { timeTemp: now, feedback: "Check in thành công" };
  }
  async #checkOutStudent(student, classId, now) {
    await studentLogService.create({
      id: await createUuidv7(),
      studentId: student.id,
      classId,
      logTime: now,
      direction: "OUT"
    });

    return { timeTemp: now, feedback: "Check out thành công" };
  }
  async #checkOutTeacher(teacher, classId, now) {
    await teacherLogService.create({
      id: await createUuidv7(),
      teacherId: teacher.id,
      classId,
      logTime: now,
      direction: "OUT"
    });

    return { timeTemp: now, feedback: "Check out thành công" };
  }
}

module.exports = new AttendanceService();
